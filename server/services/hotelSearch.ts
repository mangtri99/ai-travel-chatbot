import axios from 'axios'
import { searchMockHotels } from '../data/mockHotels.js'
import type { Hotel, SearchParams } from '../types.js'

/**
 * Single entry point for hotel search.
 * Swap provider via HOTEL_PROVIDER env var:
 *   HOTEL_PROVIDER=mock  → mock data (default, for demo)
 *   HOTEL_PROVIDER=api   → your real Search API
 */
export async function searchHotels(params: SearchParams): Promise<Hotel[]> {
  const provider = process.env.HOTEL_PROVIDER ?? 'mock'

  if (provider === 'api') {
    return searchFromApi(params)
  }

  return searchMockHotels(params)
}

async function searchFromApi(params: SearchParams): Promise<Hotel[]> {
  const baseUrl = process.env.HOTEL_API_URL
  if (!baseUrl) throw new Error('HOTEL_API_URL is not set')

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (process.env.HOTEL_API_KEY) {
    headers['Authorization'] = `Bearer ${process.env.HOTEL_API_KEY}`
  }

  const { data } = await axios.post<Hotel[]>(`${baseUrl}/search`, params, { headers })
  return data
}
