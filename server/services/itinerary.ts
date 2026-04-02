import Anthropic from '@anthropic-ai/sdk'
import type { Hotel, ItineraryDay } from '../types.js'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const MODEL = process.env.CLAUDE_MODEL ?? 'claude-haiku-4-5-20251001'

const itineraryTool: Anthropic.Tool = {
  name: 'create_itinerary',
  description: 'Create a structured day-by-day travel itinerary for a hotel destination.',
  input_schema: {
    type: 'object',
    properties: {
      days: {
        type: 'array',
        description: 'Array of itinerary days',
        items: {
          type: 'object',
          properties: {
            day: { type: 'number', description: 'Day number (1-based)' },
            title: { type: 'string', description: 'Short title for the day, e.g. "Arrival & City Highlights"' },
            activities: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  time: { type: 'string', description: 'Time of activity, e.g. "09:00 AM"' },
                  type: {
                    type: 'string',
                    enum: ['activity', 'food', 'transport', 'hotel'],
                    description: 'Type of activity',
                  },
                  title: { type: 'string', description: 'Short title of the activity' },
                  description: { type: 'string', description: 'Detailed description' },
                  estimatedCost: { type: 'number', description: 'Estimated cost in USD per person (optional)' },
                  tips: { type: 'string', description: 'Practical tips (optional)' },
                },
                required: ['time', 'type', 'title', 'description'],
              },
            },
          },
          required: ['day', 'title', 'activities'],
        },
      },
      totalEstimatedCost: {
        type: 'number',
        description: 'Total estimated cost in USD per person for the entire trip (excluding hotel)',
      },
      currency: { type: 'string', description: 'Currency code, e.g. "USD"' },
      tips: {
        type: 'array',
        items: { type: 'string' },
        description: 'General pro tips for traveling to this destination (3-5 tips)',
      },
    },
    required: ['days', 'totalEstimatedCost', 'currency', 'tips'],
  },
}

export async function generateItinerary(
  hotel: Hotel,
  nights: number,
  guests: number,
): Promise<{
  days: ItineraryDay[]
  totalEstimatedCost: number
  currency: string
  tips: string[]
}> {
  const prompt = `Create a detailed ${nights}-night travel itinerary for ${guests} guest(s) staying at ${hotel.name} in ${hotel.destinationDetails.displayName}.

Guidelines:
- Day 1 must start with hotel check-in activity
- Last day must end with hotel check-out activity
- Include 4-5 activities per day
- Mix of sightseeing, local food experiences, culture, and leisure
- Include transport activities where needed (airport transfers, getting around)
- Provide realistic estimated costs in USD per person for each paid activity
- Add practical tips for activities where relevant
- General pro tips should cover local customs, best times, money-saving advice, and must-know info
- Keep descriptions informative and engaging`

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4096,
    tools: [itineraryTool],
    tool_choice: { type: 'tool', name: 'create_itinerary' },
    messages: [{ role: 'user', content: prompt }],
  })

  const toolUse = response.content.find((block): block is Anthropic.ToolUseBlock => block.type === 'tool_use')
  if (!toolUse) {
    throw new Error('No tool use block returned from Claude')
  }

  const input = toolUse.input as {
    days: ItineraryDay[]
    totalEstimatedCost: number
    currency: string
    tips: string[]
  }

  return input
}
