<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useCompareStore } from '@/stores/compareStore'
import { useItineraryStore } from '@/stores/itineraryStore'
import { useHotelResults } from '@/composables/useHotelResults'

const store = useCompareStore()
const itineraryStore = useItineraryStore()
const { formatPrice, ratingLabel } = useHotelResults()

const hotels = computed(() => store.selected)

// Highlight helpers
const lowestPrice = computed(() =>
  Math.min(...hotels.value.map((h) => h.currentCheapestPrice)),
)
const highestRating = computed(() =>
  Math.max(...hotels.value.map((h) => h.guestRating)),
)
const highestReviews = computed(() =>
  Math.max(...hotels.value.map((h) => h.guestRatingCount)),
)

function isLowestPrice(price: number) {
  return hotels.value.length > 1 && price === lowestPrice.value
}
function isHighestRating(rating: number) {
  return hotels.value.length > 1 && rating === highestRating.value
}
function isHighestReviews(count: number) {
  return hotels.value.length > 1 && count === highestReviews.value
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') store.close()
}
onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="store.isOpen"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="store.close()"
        />

        <!-- Panel -->
        <div class="relative z-10 w-full sm:max-w-4xl bg-white sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh]">
          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
            <div>
              <h2 class="text-base font-bold text-gray-900">Hotel Comparison</h2>
              <p class="text-xs text-gray-400 mt-0.5">{{ hotels.length }} hotels compared</p>
            </div>
            <button
              class="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
              @click="store.close()"
            >
              <Icon icon="mdi:close" class="text-xl" />
            </button>
          </div>

          <!-- Table -->
          <div class="overflow-auto flex-1">
            <table class="w-full border-collapse">
              <colgroup>
                <col class="w-28" />
                <col v-for="h in hotels" :key="h.id" />
              </colgroup>

              <!-- Hotel images + names header -->
              <thead>
                <tr>
                  <th class="p-3 bg-gray-50 border-b border-gray-100" />
                  <th
                    v-for="hotel in hotels"
                    :key="hotel.id"
                    class="p-3 bg-gray-50 border-b border-gray-100 border-l border-gray-100 align-top"
                  >
                    <div class="flex flex-col items-center gap-2">
                      <div class="relative w-full h-28 rounded-xl overflow-hidden bg-sky-100">
                        <img
                          v-if="hotel.images?.[0]"
                          :src="hotel.images[0]"
                          :alt="hotel.name"
                          class="w-full h-full object-cover"
                        />
                        <div v-else class="absolute inset-0 flex items-center justify-center">
                          <Icon icon="mdi:office-building" class="text-sky-300 text-4xl" />
                        </div>
                      </div>
                      <p class="text-xs font-semibold text-gray-900 text-center leading-snug line-clamp-2">
                        {{ hotel.name }}
                      </p>
                      <button
                        class="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-0.5"
                        @click="store.remove(hotel.id)"
                      >
                        <Icon icon="mdi:close-circle-outline" class="text-sm" />
                        Remove
                      </button>
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody>
                <!-- Location -->
                <tr class="hover:bg-gray-50/60 transition-colors">
                  <td class="px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50/50 border-b border-gray-100">
                    Location
                  </td>
                  <td
                    v-for="hotel in hotels"
                    :key="hotel.id"
                    class="px-3 py-3 text-sm text-gray-700 border-b border-gray-100 border-l border-gray-100 align-top"
                  >
                    <div class="flex items-start gap-1">
                      <Icon icon="mdi:map-marker" class="text-sky-500 flex-shrink-0 mt-0.5" />
                      <span>{{ hotel.destinationDetails?.displayName }}</span>
                    </div>
                  </td>
                </tr>

                <!-- Price -->
                <tr class="hover:bg-gray-50/60 transition-colors">
                  <td class="px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50/50 border-b border-gray-100">
                    Price/night
                  </td>
                  <td
                    v-for="hotel in hotels"
                    :key="hotel.id"
                    class="px-3 py-3 border-b border-gray-100 border-l border-gray-100 align-top"
                  >
                    <span
                      class="text-sm font-bold"
                      :class="isLowestPrice(hotel.currentCheapestPrice)
                        ? 'text-emerald-600'
                        : 'text-gray-900'"
                    >
                      {{ formatPrice(hotel) }}
                    </span>
                    <span
                      v-if="isLowestPrice(hotel.currentCheapestPrice)"
                      class="ml-1 text-xs bg-emerald-100 text-emerald-700 rounded-full px-1.5 py-0.5 font-medium"
                    >
                      Best price
                    </span>
                  </td>
                </tr>

                <!-- Rating -->
                <tr class="hover:bg-gray-50/60 transition-colors">
                  <td class="px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50/50 border-b border-gray-100">
                    Rating
                  </td>
                  <td
                    v-for="hotel in hotels"
                    :key="hotel.id"
                    class="px-3 py-3 border-b border-gray-100 border-l border-gray-100 align-top"
                  >
                    <div class="flex items-center gap-1.5">
                      <div
                        class="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                        :class="isHighestRating(hotel.guestRating)
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-gray-100 text-gray-700'"
                      >
                        <Icon icon="mdi:star" class="text-amber-400" />
                        {{ (hotel.guestRating / 10).toFixed(1) }}
                      </div>
                      <span
                        class="text-xs font-medium"
                        :class="isHighestRating(hotel.guestRating) ? 'text-amber-600' : 'text-gray-500'"
                      >
                        {{ ratingLabel(hotel.guestRating) }}
                      </span>
                    </div>
                  </td>
                </tr>

                <!-- Reviews -->
                <tr class="hover:bg-gray-50/60 transition-colors">
                  <td class="px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50/50 border-b border-gray-100">
                    Reviews
                  </td>
                  <td
                    v-for="hotel in hotels"
                    :key="hotel.id"
                    class="px-3 py-3 text-sm border-b border-gray-100 border-l border-gray-100 align-top"
                  >
                    <span
                      :class="isHighestReviews(hotel.guestRatingCount) ? 'text-sky-600 font-semibold' : 'text-gray-700'"
                    >
                      {{ hotel.guestRatingCount.toLocaleString() }}
                    </span>
                  </td>
                </tr>

                <!-- Property Type -->
                <tr class="hover:bg-gray-50/60 transition-colors">
                  <td class="px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50/50 border-b border-gray-100">
                    Type
                  </td>
                  <td
                    v-for="hotel in hotels"
                    :key="hotel.id"
                    class="px-3 py-3 text-sm text-gray-700 border-b border-gray-100 border-l border-gray-100 align-top"
                  >
                    {{ hotel.propertyType ?? '—' }}
                  </td>
                </tr>

                <!-- Amenities -->
                <tr class="hover:bg-gray-50/60 transition-colors">
                  <td class="px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50/50 border-b border-gray-100 align-top">
                    Amenities
                  </td>
                  <td
                    v-for="hotel in hotels"
                    :key="hotel.id"
                    class="px-3 py-3 border-b border-gray-100 border-l border-gray-100 align-top"
                  >
                    <div class="flex flex-wrap gap-1">
                      <span
                        v-for="amenity in hotel.hotelAmenities.slice(0, 8)"
                        :key="amenity"
                        class="text-xs bg-sky-50 text-sky-700 rounded-full px-2 py-0.5"
                      >
                        {{ amenity }}
                      </span>
                      <span
                        v-if="hotel.hotelAmenities.length > 8"
                        class="text-xs text-gray-400"
                      >
                        +{{ hotel.hotelAmenities.length - 8 }} more
                      </span>
                    </div>
                  </td>
                </tr>

                <!-- Actions -->
                <tr>
                  <td class="px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50/50" />
                  <td
                    v-for="hotel in hotels"
                    :key="hotel.id"
                    class="px-3 py-3 border-l border-gray-100"
                  >
                    <div class="flex flex-col gap-1.5">
                      <a
                        v-if="hotel.url"
                        :href="hotel.url"
                        target="_blank"
                        rel="noopener"
                        class="text-center bg-sky-500 hover:bg-sky-600 text-white text-xs font-medium rounded-lg px-2 py-1.5 transition-colors"
                      >
                        View
                      </a>
                      <button
                        class="flex items-center justify-center gap-1 border border-sky-400 text-sky-600 hover:bg-sky-50 text-xs font-medium rounded-lg px-2 py-1.5 transition-colors"
                        @click="store.close(); itineraryStore.openFor(hotel)"
                      >
                        <Icon icon="mdi:map-clock" class="text-sm" />
                        Plan Trip
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
