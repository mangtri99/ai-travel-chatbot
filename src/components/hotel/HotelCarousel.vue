<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { Hotel } from '@/types'
import HotelCard from './HotelCard.vue'
import HotelCardSkeleton from './HotelCardSkeleton.vue'
import { useCompareStore } from '@/stores/compareStore'

defineProps<{
  hotels?: Hotel[]
  isLoading?: boolean
}>()

const compareStore = useCompareStore()
</script>

<template>
  <div class="mt-3 -mx-1">
    <!-- Compare bar above cards -->
    <div v-if="hotels?.length" class="flex items-center justify-between px-1 mb-2">
      <p class="text-xs text-gray-400">
        {{ hotels.length }} hotel{{ hotels.length !== 1 ? 's' : '' }} found · scroll to see more
      </p>
      <button
        class="flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1 border transition-all duration-150"
        :class="compareStore.selected.length >= 2
          ? 'bg-sky-500 text-white border-sky-500 hover:bg-sky-600'
          : compareStore.selected.length === 1
            ? 'bg-sky-50 text-sky-600 border-sky-300 hover:bg-sky-100'
            : 'bg-white text-gray-500 border-gray-200 hover:border-sky-300 hover:text-sky-500'"
        @click="compareStore.selected.length >= 2 ? compareStore.open() : null"
      >
        <Icon icon="mdi:compare" class="text-sm" />
        <span v-if="compareStore.selected.length === 0">Compare hotels</span>
        <span v-else-if="compareStore.selected.length === 1">Select 1 more</span>
        <span v-else>Compare ({{ compareStore.selected.length }})</span>
      </button>
    </div>

    <div class="flex gap-3 overflow-x-auto pb-2 px-1 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <!-- Skeleton placeholders while streaming -->
      <template v-if="isLoading && !hotels?.length">
        <HotelCardSkeleton v-for="i in 3" :key="i" class="snap-start" />
      </template>

      <!-- Actual results -->
      <HotelCard
        v-for="hotel in hotels"
        :key="hotel.id"
        :hotel="hotel"
        class="snap-start"
      />
    </div>
  </div>
</template>
