import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Hotel } from '@/types'

const MAX = 3

export const useCompareStore = defineStore('compare', () => {
  const selected = ref<Hotel[]>([])
  const isOpen = ref(false)

  const canAdd = computed(() => selected.value.length < MAX)

  function isSelected(hotel: Hotel) {
    return selected.value.some((h) => h.id === hotel.id)
  }

  function toggle(hotel: Hotel) {
    if (isSelected(hotel)) {
      selected.value = selected.value.filter((h) => h.id !== hotel.id)
    } else if (canAdd.value) {
      selected.value.push(hotel)
    }
  }

  function remove(id: string) {
    selected.value = selected.value.filter((h) => h.id !== id)
  }

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function clear() {
    selected.value = []
    isOpen.value = false
  }

  return { selected, isOpen, canAdd, MAX, isSelected, toggle, remove, open, close, clear }
})
