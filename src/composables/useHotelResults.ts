import type { Hotel } from '@/types'

const FACILITY_ICONS: Record<string, string> = {
  pool: 'mdi:pool',
  wifi: 'mdi:wifi',
  parking: 'mdi:car',
  gym: 'mdi:dumbbell',
  spa: 'mdi:spa',
  restaurant: 'mdi:silverware-fork-knife',
  bar: 'mdi:glass-cocktail',
  beach: 'mdi:beach',
  'air conditioning': 'mdi:air-conditioner',
  breakfast: 'mdi:coffee',
  'pet friendly': 'mdi:paw',
  airport: 'mdi:airplane',
}

export function useHotelResults() {
  function facilityIcon(facility: string): string {
    const key = facility.toLowerCase()
    return FACILITY_ICONS[key] ?? 'mdi:check-circle-outline'
  }

  function formatPrice(hotel: Hotel): string {
    return `${hotel.currency ?? '$'}${hotel.price_per_night.toLocaleString()}`
  }

  function ratingLabel(rating: number): string {
    if (rating >= 4.5) return 'Excellent'
    if (rating >= 4.0) return 'Very Good'
    if (rating >= 3.5) return 'Good'
    return 'Fair'
  }

  return { facilityIcon, formatPrice, ratingLabel }
}
