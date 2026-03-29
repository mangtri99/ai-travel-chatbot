import type { StreamChunk } from '@/types'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

export async function streamChat(
  message: string,
  sessionId: string,
  onChunk: (chunk: StreamChunk) => void,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId }),
    signal,
  })

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`)
  }

  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('text/event-stream')) {
    const reader = response.body!.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const data = line.slice(6).trim()
        if (data === '[DONE]') return
        try {
          onChunk(JSON.parse(data) as StreamChunk)
        } catch {
          // ignore malformed chunks
        }
      }
    }
  } else {
    // Non-streaming JSON fallback
    const data = await response.json()
    if (data.content) onChunk({ type: 'text', content: data.content })
    if (data.hotels) onChunk({ type: 'hotels', hotels: data.hotels })
    onChunk({ type: 'done' })
  }
}
