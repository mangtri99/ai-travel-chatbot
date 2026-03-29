import type { VercelRequest, VercelResponse } from '@vercel/node'
import { streamChat } from '../server/services/claude'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { message, sessionId } = req.body as { message?: string; sessionId?: string }

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'message is required' })
    return
  }

  if (!sessionId || typeof sessionId !== 'string') {
    res.status(400).json({ error: 'sessionId is required' })
    return
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.status(200)

  const sendChunk = (chunk: object) => {
    res.write(`data: ${JSON.stringify(chunk)}\n\n`)
  }

  try {
    await streamChat(message, sessionId, sendChunk)
    sendChunk({ type: 'done' })
  } catch (err) {
    console.error('[chat] error:', err)
    sendChunk({ type: 'error', error: 'Something went wrong. Please try again.' })
  } finally {
    res.end()
  }
}
