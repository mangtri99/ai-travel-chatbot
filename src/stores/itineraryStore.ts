import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Hotel, Itinerary } from '@/types'
import { fetchItinerary } from '@/services/itineraryApi'

export const useItineraryStore = defineStore('itinerary', () => {
  const isOpen = ref(false)
  const isLoading = ref(false)
  const itinerary = ref<Itinerary | null>(null)
  const error = ref<string | null>(null)
  const nights = ref(3)
  const guests = ref(2)

  async function openFor(hotel: Hotel) {
    isOpen.value = true
    isLoading.value = true
    itinerary.value = null
    error.value = null

    try {
      itinerary.value = await fetchItinerary(hotel, nights.value, guests.value)
    } catch {
      error.value = 'Failed to generate itinerary. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  function close() {
    isOpen.value = false
    itinerary.value = null
    error.value = null
  }

  return { isOpen, isLoading, itinerary, error, nights, guests, openFor, close }
})
