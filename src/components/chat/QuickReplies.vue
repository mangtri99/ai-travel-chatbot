<script setup lang="ts">
import { Icon } from '@iconify/vue'

const emit = defineEmits<{ select: [message: string] }>()

const suggestions = [
  { icon: 'mdi:beach', text: 'Hotels in Bali with a pool, 2 nights' },
  { icon: 'mdi:city', text: 'Budget hotels in Paris under $100' },
  { icon: 'mdi:mountain', text: 'Resort in Swiss Alps for 4 people' },
  { icon: 'mdi:island', text: 'Beachfront resort in Phuket' },
]
</script>

<template>
  <div class="space-y-3 py-6">
    <p class="text-center text-sm text-gray-400">Try asking something like:</p>
    <div class="flex flex-wrap gap-2 justify-center">
      <button
        v-for="s in suggestions"
        :key="s.text"
        class="flex items-center gap-2 bg-white hover:bg-sky-50 border border-gray-200 hover:border-sky-300 text-gray-700 hover:text-sky-700 text-sm rounded-full px-4 py-2 transition-colors shadow-sm"
        @click="emit('select', s.text)"
      >
        <Icon :icon="s.icon" class="text-sky-500" />
        {{ s.text }}
      </button>
    </div>
  </div>
</template>
