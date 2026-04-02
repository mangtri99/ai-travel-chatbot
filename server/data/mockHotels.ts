import { createRequire } from 'module'
import type { Hotel, SearchParams } from '../types.js'

const require = createRequire(import.meta.url)
const HOTELS: Hotel[] = require('../../data.json')

export function searchMockHotels(params: SearchParams): Hotel[] {
  const location = params.location.toLowerCase()

  let results = HOTELS.filter((h) => {
    const dest = h.destinationDetails
    const displayName = dest?.displayName?.toLowerCase() ?? ''
    const city = dest?.city?.toLowerCase() ?? ''
    const country = dest?.country?.toLowerCase() ?? ''
    const keywords = dest?.keywords?.map((k) => k.toLowerCase()) ?? []

    return (
      displayName.includes(location) ||
      city.includes(location) ||
      country.includes(location) ||
      keywords.some((k) => k.includes(location) || location.includes(k))
    )
  })

  if (params.budget_max) {
    results = results.filter((h) => h.currentCheapestPrice <= params.budget_max!)
  }

  if (params.facilities?.length) {
    results = results.sort((a, b) => {
      const aMatches = params.facilities!.filter((f) =>
        a.hotelAmenities.some((af) => af.toLowerCase().includes(f.toLowerCase())),
      ).length
      const bMatches = params.facilities!.filter((f) =>
        b.hotelAmenities.some((bf) => bf.toLowerCase().includes(f.toLowerCase())),
      ).length
      return bMatches - aMatches
    })
  }

  // Fallback: return a random sample if no location match
  if (results.length === 0) {
    results = [...HOTELS].sort(() => Math.random() - 0.5).slice(0, 4)
  }

  return results.slice(0, 6)
}
