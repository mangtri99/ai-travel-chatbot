<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import type { Message } from '@/types'
import StreamingText from '@/components/shared/StreamingText.vue'
import HotelCarousel from '@/components/hotel/HotelCarousel.vue'
import TypingIndicator from './TypingIndicator.vue'
import { useVoice } from '@/composables/useVoice'

const props = defineProps<{ message: Message }>()

const { isSpeaking, ttsSupported, speak, stopSpeaking } = useVoice()
const activeSpeakId = ref<string | null>(null)

function toggleSpeak() {
  if (activeSpeakId.value === props.message.id && isSpeaking.value) {
    stopSpeaking()
    activeSpeakId.value = null
    return
  }
  activeSpeakId.value = props.message.id
  speak(props.message.content)
}

const isSpeakingThis = () => activeSpeakId.value === props.message.id && isSpeaking.value
</script>

<template>
  <!-- User message -->
  <div v-if="message.role === 'user'" class="flex justify-end gap-2">
    <div class="max-w-[75%] bg-sky-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
      <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ message.content }}</p>
    </div>
    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center mt-auto">
      <Icon icon="mdi:account" class="text-sky-600 text-lg" />
    </div>
  </div>

  <!-- Assistant message -->
  <div v-else class="flex gap-2">
    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center mt-auto shadow-sm">
      <Icon icon="mdi:robot-excited" class="text-white text-lg" />
    </div>
    <div class="max-w-[85%]">
      <div class="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <!-- Typing animation when no content yet -->
        <TypingIndicator v-if="message.isStreaming && !message.content" />

        <div v-else class="flex items-start gap-2">
          <p class="flex-1 text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
            <StreamingText :text="message.content" :is-streaming="message.isStreaming" />
          </p>

          <!-- TTS button (shown after streaming done) -->
          <button
            v-if="ttsSupported && !message.isStreaming && message.content"
            :title="isSpeakingThis() ? 'Stop' : 'Listen'"
            class="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
            :class="isSpeakingThis()
              ? 'text-sky-500 bg-sky-50 animate-pulse'
              : 'text-gray-300 hover:text-sky-400 hover:bg-sky-50'"
            @click="toggleSpeak"
          >
            <Icon :icon="isSpeakingThis() ? 'mdi:volume-off' : 'mdi:volume-high'" class="text-sm" />
          </button>
        </div>
      </div>

      <!-- Hotel results -->
      <HotelCarousel
        v-if="message.hotels?.length || message.isStreaming"
        :hotels="message.hotels"
        :is-loading="message.isStreaming && !message.hotels?.length"
      />
    </div>
  </div>
</template>
