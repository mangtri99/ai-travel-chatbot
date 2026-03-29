<script setup lang="ts">
import type { Hotel } from '@/types'
import HotelCard from './HotelCard.vue'
import HotelCardSkeleton from './HotelCardSkeleton.vue'

defineProps<{
  hotels?: Hotel[]
  isLoading?: boolean
}>()
</script>

<template>
  <div class="mt-3 -mx-1">
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

    <p v-if="hotels?.length" class="text-xs text-gray-400 mt-1 px-1">
      {{ hotels.length }} hotel{{ hotels.length !== 1 ? 's' : '' }} found · scroll to see more
    </p>
  </div>
</template>
