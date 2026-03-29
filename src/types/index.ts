export interface Hotel {
  id: string
  name: string
  location: string
  price_per_night: number
  currency: string
  rating: number
  review_count: number
  image_url: string
  facilities: string[]
  description: string
  url?: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  hotels?: Hotel[]
  timestamp: Date
  isStreaming?: boolean
}

export interface StreamChunk {
  type: 'text' | 'hotels' | 'done' | 'error'
  content?: string
  hotels?: Hotel[]
  error?: string
}

export interface ChatRequest {
  message: string
  sessionId: string
}
