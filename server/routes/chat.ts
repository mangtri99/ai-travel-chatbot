import { Router } from 'express'
import type { Request, Response } from 'express'
import { streamChat } from '../services/claude'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
  const { message, sessionId } = req.body

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'message is required' })
    return
  }

  if (!sessionId || typeof sessionId !== 'string') {
    res.status(400).json({ error: 'sessionId is required' })
    return
  }

  // Set up SSE
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

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
})

export default router
