import Anthropic from '@anthropic-ai/sdk'
import type { MessageParam } from '@anthropic-ai/sdk/resources/messages'
import { searchHotels } from './hotelSearch'
import type { StreamChunk, SearchParams } from '../types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const MODEL = process.env.CLAUDE_MODEL ?? 'claude-haiku-4-5-20251001'

// In-memory conversation history per session
const conversations = new Map<string, MessageParam[]>()

const SYSTEM_PROMPT = `You are a friendly and knowledgeable AI travel assistant specialized in finding hotels and accommodations.

Your primary goal is to help users find the perfect place to stay by understanding their needs and preferences.

## How to help users:
- When users mention a destination or ask about hotels, ALWAYS use the search_hotels tool to find relevant options.
- Extract key details from user messages: location, check-in/check-out dates, number of guests, budget, and desired facilities.
- If details are missing (like dates or guests), make reasonable assumptions and proceed with the search — don't ask too many follow-up questions before searching.
- After showing results, offer to refine the search based on their feedback.

## Handling off-topic questions:
If the user asks about something unrelated to travel, hotels, or destinations (e.g., coding, recipes, politics), respond briefly and warmly, then redirect:
"That's a bit outside my travel expertise! I'm here to help you find amazing hotels and plan your trip. Where would you like to stay next?"

## Tone & style:
- Be warm, enthusiastic, and concise.
- Use travel-related language that feels inspiring.
- Keep responses short — the hotel cards will do the visual heavy lifting.
- Always respond in the same language the user is using.`

const SEARCH_HOTELS_TOOL: Anthropic.Tool = {
  name: 'search_hotels',
  description:
    'Search for hotels based on location, dates, budget, number of guests, and desired facilities. Always use this tool when the user wants to find accommodation.',
  input_schema: {
    type: 'object' as const,
    properties: {
      location: {
        type: 'string',
        description: 'City or destination name, e.g. "Bali", "Paris", "Phuket"',
      },
      check_in: {
        type: 'string',
        description: 'Check-in date in YYYY-MM-DD format',
      },
      check_out: {
        type: 'string',
        description: 'Check-out date in YYYY-MM-DD format',
      },
      guests: {
        type: 'number',
        description: 'Number of guests',
      },
      budget_max: {
        type: 'number',
        description: 'Maximum budget per night in USD',
      },
      facilities: {
        type: 'array',
        items: { type: 'string' },
        description: 'Desired facilities, e.g. ["pool", "wifi", "spa", "gym", "beach"]',
      },
    },
    required: ['location'],
  },
}

async function processMessages(
  messages: MessageParam[],
  sendChunk: (chunk: StreamChunk) => void,
): Promise<MessageParam[]> {
  const stream = anthropic.messages.stream({
    model: MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    tools: [SEARCH_HOTELS_TOOL],
    messages,
  })

  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta' &&
      event.delta.text
    ) {
      sendChunk({ type: 'text', content: event.delta.text })
    }
  }

  const finalMessage = await stream.finalMessage()
  const updatedMessages: MessageParam[] = [
    ...messages,
    { role: 'assistant', content: finalMessage.content },
  ]

  if (finalMessage.stop_reason === 'tool_use') {
    const toolBlock = finalMessage.content.find((b) => b.type === 'tool_use')

    if (toolBlock && toolBlock.type === 'tool_use' && toolBlock.name === 'search_hotels') {
      const hotels = await searchHotels(toolBlock.input as SearchParams)
      sendChunk({ type: 'hotels', hotels })

      const messagesWithResult: MessageParam[] = [
        ...updatedMessages,
        {
          role: 'user',
          content: [
            {
              type: 'tool_result',
              tool_use_id: toolBlock.id,
              content: JSON.stringify(hotels),
            },
          ],
        },
      ]

      return processMessages(messagesWithResult, sendChunk)
    }
  }

  return updatedMessages
}

export async function streamChat(
  message: string,
  sessionId: string,
  sendChunk: (chunk: StreamChunk) => void,
): Promise<void> {
  const history = conversations.get(sessionId) ?? []
  const messages: MessageParam[] = [...history, { role: 'user', content: message }]

  const finalMessages = await processMessages(messages, sendChunk)

  // Keep last 20 messages to avoid hitting token limits
  conversations.set(sessionId, finalMessages.slice(-20))
}
