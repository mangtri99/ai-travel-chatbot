<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { Hotel } from '@/types'
import { useHotelResults } from '@/composables/useHotelResults'

defineProps<{ hotel: Hotel }>()

const { facilityIcon, formatPrice, ratingLabel } = useHotelResults()
</script>

<template>
  <div class="flex-shrink-0 w-64 bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
    <!-- Image -->
    <div class="relative h-36 bg-gradient-to-br from-sky-400 to-blue-600 overflow-hidden">
      <img
        v-if="hotel.image_url"
        :src="hotel.image_url"
        :alt="hotel.name"
        class="w-full h-full object-cover"
      />
      <div v-else class="absolute inset-0 flex items-center justify-center">
        <Icon icon="mdi:office-building" class="text-white/40 text-6xl" />
      </div>
      <!-- Rating badge -->
      <div class="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1 text-xs font-semibold text-amber-500">
        <Icon icon="mdi:star" class="text-amber-400" />
        {{ hotel.rating.toFixed(1) }}
      </div>
    </div>

    <!-- Content -->
    <div class="p-3 space-y-2">
      <div>
        <h3 class="font-semibold text-gray-900 text-sm leading-tight line-clamp-1">{{ hotel.name }}</h3>
        <div class="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
          <Icon icon="mdi:map-marker" class="text-sky-500 flex-shrink-0" />
          <span class="truncate">{{ hotel.location }}</span>
        </div>
      </div>

      <!-- Rating label + reviews -->
      <div class="flex items-center gap-1 text-xs text-gray-500">
        <span class="text-emerald-600 font-medium">{{ ratingLabel(hotel.rating) }}</span>
        <span>·</span>
        <span>{{ hotel.review_count.toLocaleString() }} reviews</span>
      </div>

      <!-- Facilities -->
      <div class="flex flex-wrap gap-1">
        <span
          v-for="facility in hotel.facilities.slice(0, 3)"
          :key="facility"
          class="inline-flex items-center gap-0.5 bg-sky-50 text-sky-700 rounded-full px-2 py-0.5 text-xs"
        >
          <Icon :icon="facilityIcon(facility)" class="text-xs" />
          {{ facility }}
        </span>
        <span
          v-if="hotel.facilities.length > 3"
          class="text-xs text-gray-400"
        >+{{ hotel.facilities.length - 3 }} more</span>
      </div>

      <!-- Price + CTA -->
      <div class="flex items-center justify-between pt-1 border-t border-gray-100">
        <div>
          <span class="text-base font-bold text-gray-900">{{ formatPrice(hotel) }}</span>
          <span class="text-xs text-gray-400"> /night</span>
        </div>
        <a
          v-if="hotel.url"
          :href="hotel.url"
          target="_blank"
          rel="noopener"
          class="bg-sky-500 hover:bg-sky-600 text-white text-xs font-medium rounded-lg px-3 py-1.5 transition-colors"
        >View</a>
        <button
          v-else
          class="bg-sky-500 hover:bg-sky-600 text-white text-xs font-medium rounded-lg px-3 py-1.5 transition-colors"
        >View</button>
      </div>
    </div>
  </div>
</template>
