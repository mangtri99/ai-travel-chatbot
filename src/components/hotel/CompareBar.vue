<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useCompareStore } from '@/stores/compareStore'

const store = useCompareStore()
</script>

<template>
  <Transition name="bar">
    <div
      v-if="store.selected.length > 0"
      class="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl px-4 py-3"
    >
      <div class="max-w-2xl mx-auto flex items-center gap-3">
        <!-- Slots -->
        <div class="flex flex-1 gap-2">
          <div
            v-for="i in store.MAX"
            :key="i"
            class="flex-1 h-14 rounded-xl border-2 flex items-center gap-2 px-2 overflow-hidden transition-all duration-200"
            :class="store.selected[i - 1]
              ? 'border-sky-400 bg-sky-50'
              : 'border-dashed border-gray-200 bg-gray-50'"
          >
            <template v-if="store.selected[i - 1]">
              <img
                v-if="store.selected[i - 1].images?.[0]"
                :src="store.selected[i - 1].images[0]"
                class="w-9 h-9 rounded-lg object-cover flex-shrink-0"
              />
              <div v-else class="w-9 h-9 rounded-lg bg-sky-200 flex items-center justify-center flex-shrink-0">
                <Icon icon="mdi:office-building" class="text-sky-500 text-lg" />
              </div>
              <span class="text-xs font-medium text-gray-800 truncate flex-1 leading-tight">
                {{ store.selected[i - 1].name }}
              </span>
              <button
                class="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                @click="store.remove(store.selected[i - 1].id)"
              >
                <Icon icon="mdi:close" class="text-base" />
              </button>
            </template>
            <template v-else>
              <span class="text-xs text-gray-400 mx-auto">Slot {{ i }}</span>
            </template>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-1.5 flex-shrink-0">
          <button
            :disabled="store.selected.length < 2"
            class="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-150"
            :class="store.selected.length >= 2
              ? 'bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-200'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
            @click="store.open()"
          >
            Compare {{ store.selected.length >= 2 ? `(${store.selected.length})` : '' }}
          </button>
          <button
            class="text-xs text-gray-400 hover:text-gray-600 transition-colors text-center"
            @click="store.clear()"
          >
            Clear all
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.bar-enter-active,
.bar-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.bar-enter-from,
.bar-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
