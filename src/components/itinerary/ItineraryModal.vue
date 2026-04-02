<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useItineraryStore } from '@/stores/itineraryStore'
import ItineraryDay from './ItineraryDay.vue'

const store = useItineraryStore()
const activeDay = ref(1)

// Reset active day when a new itinerary loads
watch(
  () => store.itinerary,
  (val) => {
    if (val) activeDay.value = 1
  },
)

// Close on Escape key
function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && store.isOpen) store.close()
}
onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown))

function printItinerary() {
  window.print()
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="store.isOpen"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm print:hidden-backdrop"
        @click.self="store.close()"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="store.isOpen"
            class="relative w-full sm:max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] print:shadow-none print:max-h-none print:rounded-none"
          >
            <!-- Header -->
            <div class="flex items-center gap-3 px-5 py-4 border-b border-gray-100 flex-shrink-0 print:hidden">
              <button
                class="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
                @click="store.close()"
              >
                <Icon icon="mdi:arrow-left" class="text-xl" />
              </button>
              <div class="flex-1 min-w-0">
                <p class="text-xs text-gray-400 font-medium uppercase tracking-wide">Your Itinerary</p>
                <h2 class="text-base font-bold text-gray-900 truncate">
                  {{ store.itinerary?.destination ?? store.itinerary?.hotel?.destinationDetails?.displayName ?? 'Planning your trip...' }}
                </h2>
                <p v-if="store.itinerary" class="text-xs text-gray-500 truncate">{{ store.itinerary.hotel.name }}</p>
              </div>
              <button
                class="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
                title="Print itinerary"
                @click="printItinerary"
              >
                <Icon icon="mdi:printer" class="text-xl" />
              </button>
            </div>

            <!-- Config bar (always visible) -->
            <div class="flex items-center gap-4 px-5 py-3 bg-sky-50 border-b border-sky-100 flex-shrink-0 print:hidden">
              <!-- Nights -->
              <div class="flex items-center gap-2">
                <Icon icon="mdi:weather-night" class="text-sky-500 text-lg flex-shrink-0" />
                <label class="text-xs text-gray-600 font-medium whitespace-nowrap">Nights</label>
                <div class="flex items-center gap-1">
                  <button
                    class="w-6 h-6 rounded-full border border-sky-300 text-sky-600 flex items-center justify-center text-sm hover:bg-sky-100 transition-colors disabled:opacity-40"
                    :disabled="store.nights <= 1"
                    @click="store.nights = Math.max(1, store.nights - 1)"
                  >-</button>
                  <span class="text-sm font-bold text-gray-800 w-5 text-center">{{ store.nights }}</span>
                  <button
                    class="w-6 h-6 rounded-full border border-sky-300 text-sky-600 flex items-center justify-center text-sm hover:bg-sky-100 transition-colors disabled:opacity-40"
                    :disabled="store.nights >= 7"
                    @click="store.nights = Math.min(7, store.nights + 1)"
                  >+</button>
                </div>
              </div>

              <!-- Guests -->
              <div class="flex items-center gap-2">
                <Icon icon="mdi:account-group" class="text-sky-500 text-lg flex-shrink-0" />
                <label class="text-xs text-gray-600 font-medium whitespace-nowrap">Guests</label>
                <div class="flex items-center gap-1">
                  <button
                    class="w-6 h-6 rounded-full border border-sky-300 text-sky-600 flex items-center justify-center text-sm hover:bg-sky-100 transition-colors disabled:opacity-40"
                    :disabled="store.guests <= 1"
                    @click="store.guests = Math.max(1, store.guests - 1)"
                  >-</button>
                  <span class="text-sm font-bold text-gray-800 w-5 text-center">{{ store.guests }}</span>
                  <button
                    class="w-6 h-6 rounded-full border border-sky-300 text-sky-600 flex items-center justify-center text-sm hover:bg-sky-100 transition-colors disabled:opacity-40"
                    :disabled="store.guests >= 6"
                    @click="store.guests = Math.min(6, store.guests + 1)"
                  >+</button>
                </div>
              </div>

              <div class="flex-1" />

              <!-- Regenerate button -->
              <button
                v-if="store.itinerary"
                :disabled="store.isLoading"
                class="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-xl px-3 py-1.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                @click="store.openFor(store.itinerary!.hotel)"
              >
                <Icon icon="mdi:refresh" :class="['text-sm', store.isLoading ? 'animate-spin' : '']" />
                Regenerate
              </button>
            </div>

            <!-- Scrollable body -->
            <div class="flex-1 overflow-y-auto print:overflow-visible">

              <!-- Loading state -->
              <div v-if="store.isLoading" class="flex flex-col items-center justify-center py-16 px-6 gap-6">
                <div class="relative">
                  <div class="w-16 h-16 rounded-full border-4 border-sky-100 border-t-sky-500 animate-spin" />
                  <Icon icon="mdi:airplane" class="absolute inset-0 m-auto text-sky-400 text-2xl" />
                </div>
                <div class="text-center space-y-1">
                  <p class="text-base font-semibold text-gray-700">Crafting your itinerary...</p>
                  <p class="text-sm text-gray-400">Researching the best experiences for you</p>
                </div>
                <!-- Skeleton lines -->
                <div class="w-full max-w-sm space-y-3">
                  <div v-for="i in 5" :key="i" class="flex gap-3 items-start">
                    <div class="w-12 h-3 bg-gray-100 rounded-full animate-pulse flex-shrink-0 mt-1" />
                    <div class="flex-1 space-y-1.5">
                      <div class="h-3 bg-gray-100 rounded-full animate-pulse" :style="{ width: `${60 + i * 7}%` }" />
                      <div class="h-2.5 bg-gray-50 rounded-full animate-pulse" :style="{ width: `${40 + i * 5}%` }" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Error state -->
              <div v-else-if="store.error" class="flex flex-col items-center justify-center py-16 px-6 gap-4">
                <div class="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                  <Icon icon="mdi:alert-circle-outline" class="text-red-400 text-3xl" />
                </div>
                <div class="text-center space-y-1">
                  <p class="text-base font-semibold text-gray-700">Something went wrong</p>
                  <p class="text-sm text-gray-400">{{ store.error }}</p>
                </div>
              </div>

              <!-- Itinerary content -->
              <div v-else-if="store.itinerary" class="p-5 space-y-5 print:p-0">

                <!-- Summary card -->
                <div class="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-4 text-white print:break-inside-avoid">
                  <div class="flex items-center gap-2 mb-3">
                    <Icon icon="mdi:map-marker-radius" class="text-white/80 text-lg" />
                    <span class="font-semibold text-sm">{{ store.itinerary.destination }}</span>
                  </div>
                  <div class="grid grid-cols-3 gap-3">
                    <div class="bg-white/15 rounded-xl p-2.5 text-center">
                      <p class="text-xl font-bold">{{ store.itinerary.nights }}</p>
                      <p class="text-xs text-white/75">Nights</p>
                    </div>
                    <div class="bg-white/15 rounded-xl p-2.5 text-center">
                      <p class="text-xl font-bold">{{ store.itinerary.guests }}</p>
                      <p class="text-xs text-white/75">Guests</p>
                    </div>
                    <div class="bg-white/15 rounded-xl p-2.5 text-center">
                      <p class="text-xl font-bold">${{ store.itinerary.totalEstimatedCost }}</p>
                      <p class="text-xs text-white/75">Est. Total</p>
                    </div>
                  </div>
                  <p class="text-xs text-white/60 mt-2 text-center">Estimated activity costs per person · excludes hotel</p>
                </div>

                <!-- Day tabs -->
                <div class="flex gap-2 overflow-x-auto pb-1 print:hidden -mx-1 px-1">
                  <button
                    v-for="d in store.itinerary.days"
                    :key="d.day"
                    :class="[
                      'flex-shrink-0 text-xs font-semibold rounded-xl px-3.5 py-2 transition-colors',
                      activeDay === d.day
                        ? 'bg-sky-500 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                    ]"
                    @click="activeDay = d.day"
                  >
                    Day {{ d.day }}
                  </button>
                </div>

                <!-- Active day (screen) -->
                <div class="print:hidden">
                  <ItineraryDay
                    v-if="store.itinerary.days.find(d => d.day === activeDay)"
                    :day="store.itinerary.days.find(d => d.day === activeDay)!"
                  />
                </div>

                <!-- All days (print only) -->
                <div class="hidden print:block space-y-8">
                  <ItineraryDay
                    v-for="d in store.itinerary.days"
                    :key="d.day"
                    :day="d"
                    class="print:break-inside-avoid"
                  />
                </div>

                <!-- Pro Tips -->
                <div v-if="store.itinerary.tips.length" class="bg-amber-50 rounded-2xl p-4 print:break-inside-avoid">
                  <div class="flex items-center gap-2 mb-3">
                    <Icon icon="mdi:lightbulb" class="text-amber-500 text-lg" />
                    <h4 class="text-sm font-bold text-amber-800">Pro Tips</h4>
                  </div>
                  <ul class="space-y-2">
                    <li
                      v-for="(tip, i) in store.itinerary.tips"
                      :key="i"
                      class="flex items-start gap-2 text-xs text-amber-700"
                    >
                      <Icon icon="mdi:check-circle" class="text-amber-400 flex-shrink-0 mt-0.5" />
                      {{ tip }}
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
@media print {
  body > *:not(.itinerary-print-root) {
    display: none !important;
  }
}
</style>
