<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { ItineraryDay } from '@/types'

defineProps<{ day: ItineraryDay }>()

const typeConfig = {
  hotel: { icon: 'mdi:bed', dot: 'bg-blue-500', text: 'text-blue-600' },
  activity: { icon: 'mdi:map-marker-radius', dot: 'bg-emerald-500', text: 'text-emerald-600' },
  food: { icon: 'mdi:silverware-fork-knife', dot: 'bg-orange-500', text: 'text-orange-600' },
  transport: { icon: 'mdi:car', dot: 'bg-purple-500', text: 'text-purple-600' },
} as const
</script>

<template>
  <div class="px-1">
    <!-- Day heading -->
    <h3 class="text-base font-semibold text-gray-800 mb-4">
      Day {{ day.day }}: {{ day.title }}
    </h3>

    <!-- Timeline -->
    <div class="relative">
      <!-- Vertical line -->
      <div class="absolute left-[72px] top-3 bottom-3 w-px bg-gray-200" />

      <div class="space-y-5">
        <div
          v-for="(activity, index) in day.activities"
          :key="index"
          class="flex gap-4"
        >
          <!-- Time column -->
          <div class="w-16 flex-shrink-0 text-right">
            <span class="text-xs text-gray-400 font-medium leading-5">{{ activity.time }}</span>
          </div>

          <!-- Dot -->
          <div class="flex-shrink-0 relative z-10 mt-0.5">
            <div
              :class="[typeConfig[activity.type].dot, 'w-6 h-6 rounded-full flex items-center justify-center shadow-sm']"
            >
              <Icon :icon="typeConfig[activity.type].icon" class="text-white text-xs" />
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 pb-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <p class="text-sm font-semibold text-gray-900 leading-snug">{{ activity.title }}</p>
              <span
                v-if="activity.estimatedCost != null"
                class="flex-shrink-0 text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2 py-0.5 whitespace-nowrap"
              >~${{ activity.estimatedCost }}</span>
            </div>
            <p class="text-xs text-gray-500 mt-0.5 leading-relaxed">{{ activity.description }}</p>
            <p
              v-if="activity.tips"
              class="text-xs italic text-amber-600 mt-1 leading-relaxed"
            >
              <Icon icon="mdi:lightbulb-outline" class="inline-block mr-0.5 text-amber-500" />{{ activity.tips }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
