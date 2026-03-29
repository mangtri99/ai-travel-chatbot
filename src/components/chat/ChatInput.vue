<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useVoice } from '@/composables/useVoice'

const props = defineProps<{ disabled?: boolean }>()
const emit = defineEmits<{ send: [message: string] }>()

const input = ref('')
const { isListening, sttSupported, startListening, stopListening } = useVoice()

function handleSend() {
  const text = input.value.trim()
  if (!text || props.disabled) return
  emit('send', text)
  input.value = ''
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

function toggleMic() {
  if (isListening.value) {
    stopListening()
    if (input.value.trim()) handleSend()
    return
  }
  startListening(
    (interim) => { input.value = interim },
    (final) => { input.value = final },
  )
}
</script>

<template>
  <div class="flex items-end gap-2 p-3 bg-white border-t border-gray-100">
    <textarea
      v-model="input"
      :disabled="disabled"
      rows="1"
      placeholder="Ask about hotels, destinations, budget..."
      class="flex-1 resize-none rounded-xl border border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 transition-all max-h-32 disabled:opacity-50"
      style="field-sizing: content"
      @keydown="handleKeydown"
    />

    <!-- Mic button -->
    <button
      v-if="sttSupported"
      :disabled="disabled"
      :title="isListening ? 'Stop recording' : 'Voice input'"
      class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm disabled:opacity-50"
      :class="isListening
        ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
        : 'bg-gray-100 hover:bg-gray-200 text-gray-500'"
      @click="toggleMic"
    >
      <Icon :icon="isListening ? 'mdi:microphone-off' : 'mdi:microphone'" class="text-lg" />
    </button>

    <!-- Send button -->
    <button
      :disabled="disabled || !input.trim()"
      class="flex-shrink-0 w-10 h-10 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:bg-gray-200 text-white flex items-center justify-center transition-colors shadow-sm"
      @click="handleSend"
    >
      <Icon v-if="!disabled" icon="mdi:send" class="text-lg" />
      <Icon v-else icon="mdi:loading" class="text-lg animate-spin" />
    </button>
  </div>
</template>
