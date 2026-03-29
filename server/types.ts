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

export interface StreamChunk {
  type: 'text' | 'hotels' | 'done' | 'error'
  content?: string
  hotels?: Hotel[]
  error?: string
}

export interface SearchParams {
  location: string
  check_in?: string
  check_out?: string
  guests?: number
  budget_max?: number
  currency?: string
  facilities?: string[]
}
