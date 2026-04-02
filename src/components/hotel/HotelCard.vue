<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { Hotel } from '@/types'
import { useHotelResults } from '@/composables/useHotelResults'
import { useItineraryStore } from '@/stores/itineraryStore'
import { useCompareStore } from '@/stores/compareStore'

defineProps<{ hotel: Hotel }>()

const { facilityIcon, formatPrice, ratingLabel } = useHotelResults()
const itineraryStore = useItineraryStore()
const compareStore = useCompareStore()
</script>

<template>
  <div
    class="flex-shrink-0 w-64 bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-200"
    :class="compareStore.isSelected(hotel) ? 'ring-2 ring-sky-400 shadow-sky-100' : ''"
  >
    <!-- Image -->
    <div class="relative h-36 bg-gradient-to-br from-sky-400 to-blue-600 overflow-hidden">
      <img
        v-if="hotel.images?.[0]"
        :src="hotel.images[0]"
        :alt="hotel.name"
        class="w-full h-full object-cover"
      />
      <div v-else class="absolute inset-0 flex items-center justify-center">
        <Icon icon="mdi:office-building" class="text-white/40 text-6xl" />
      </div>
      <!-- Rating badge -->
      <div class="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1 text-xs font-semibold text-amber-500">
        <Icon icon="mdi:star" class="text-amber-400" />
        {{ (hotel.guestRating / 10).toFixed(1) }}
      </div>
      <!-- Compare toggle -->
      <button
        class="absolute top-2 left-2 rounded-full w-6 h-6 flex items-center justify-center transition-all duration-150 text-xs font-bold shadow"
        :class="compareStore.isSelected(hotel)
          ? 'bg-sky-500 text-white'
          : !compareStore.canAdd
            ? 'bg-white/60 text-gray-300 cursor-not-allowed'
            : 'bg-white/90 text-gray-400 hover:text-sky-500'"
        :title="compareStore.isSelected(hotel) ? 'Remove from compare' : 'Add to compare'"
        :disabled="!compareStore.canAdd && !compareStore.isSelected(hotel)"
        @click.stop="compareStore.toggle(hotel)"
      >
        <Icon
          :icon="compareStore.isSelected(hotel) ? 'mdi:check' : 'mdi:compare'"
          class="text-sm"
        />
      </button>
    </div>

    <!-- Content -->
    <div class="p-3 space-y-2">
      <div>
        <h3 class="font-semibold text-gray-900 text-sm leading-tight line-clamp-1">{{ hotel.name }}</h3>
        <div class="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
          <Icon icon="mdi:map-marker" class="text-sky-500 flex-shrink-0" />
          <span class="truncate">{{ hotel.destinationDetails?.displayName }}</span>
        </div>
      </div>

      <!-- Rating label + reviews -->
      <div class="flex items-center gap-1 text-xs text-gray-500">
        <span class="text-emerald-600 font-medium">{{ ratingLabel(hotel.guestRating) }}</span>
        <span>·</span>
        <span>{{ hotel.guestRatingCount.toLocaleString() }} reviews</span>
      </div>

      <!-- Facilities -->
      <div class="flex flex-wrap gap-1">
        <span
          v-for="facility in hotel.hotelAmenities.slice(0, 3)"
          :key="facility"
          class="inline-flex items-center gap-0.5 bg-sky-50 text-sky-700 rounded-full px-2 py-0.5 text-xs"
        >
          <Icon :icon="facilityIcon(facility)" class="text-xs" />
          {{ facility }}
        </span>
        <span
          v-if="hotel.hotelAmenities.length > 3"
          class="text-xs text-gray-400"
        >+{{ hotel.hotelAmenities.length - 3 }} more</span>
      </div>

      <!-- Price + CTA -->
      <div class="pt-1 border-t border-gray-100">
        <div class="mb-2">
          <span class="text-base font-bold text-gray-900">{{ formatPrice(hotel) }}</span>
          <span class="text-xs text-gray-400"> /night</span>
        </div>
        <div class="flex items-center gap-1.5">
          <a
            v-if="hotel.url"
            :href="hotel.url"
            target="_blank"
            rel="noopener"
            class="flex-1 text-center bg-sky-500 hover:bg-sky-600 text-white text-xs font-medium rounded-lg px-2 py-1.5 transition-colors"
          >View</a>
          <button
            v-else
            class="flex-1 bg-sky-500 hover:bg-sky-600 text-white text-xs font-medium rounded-lg px-2 py-1.5 transition-colors"
          >View</button>
          <button
            class="flex-1 flex items-center justify-center gap-1 border border-sky-400 text-sky-600 hover:bg-sky-50 text-xs font-medium rounded-lg px-2 py-1.5 transition-colors"
            @click="itineraryStore.openFor(hotel)"
          >
            <Icon icon="mdi:map-clock" class="text-sm flex-shrink-0" />
            Plan Trip
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
