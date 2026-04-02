export interface DestinationDetails {
  country: string
  city: string
  displayName: string
  location?: { latitude: number; longitude: number }
  destinations?: string[]
  keywords?: string[]
}

export interface Hotel {
  id: string
  name: string
  currentCheapestPrice: number
  currency: string
  guestRating: number
  guestRatingCount: number
  images: string[]
  hotelAmenities: string[]
  roomAmenities?: string[]
  propertyType: string
  hasRoomAvailability: boolean
  destinationDetails: DestinationDetails
  provider?: string
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

export interface ItineraryActivity {
  time: string
  type: 'activity' | 'food' | 'transport' | 'hotel'
  title: string
  description: string
  estimatedCost?: number
  tips?: string
}

export interface ItineraryDay {
  day: number
  title: string
  activities: ItineraryActivity[]
}

export interface Itinerary {
  destination: string
  hotel: Hotel
  nights: number
  guests: number
  days: ItineraryDay[]
  totalEstimatedCost: number
  currency: string
  tips: string[]
}
