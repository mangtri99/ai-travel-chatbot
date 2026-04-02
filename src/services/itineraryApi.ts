import axios from 'axios'
import type { Hotel, Itinerary } from '@/types'

export async function fetchItinerary(hotel: Hotel, nights: number, guests: number): Promise<Itinerary> {
  const { data } = await axios.post<Itinerary>('/api/itinerary', { hotel, nights, guests })
  return data
}
