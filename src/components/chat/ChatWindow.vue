<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { useStreamingChat } from '@/composables/useStreamingChat'
import MessageBubble from './MessageBubble.vue'
import ChatInput from './ChatInput.vue'
import QuickReplies from './QuickReplies.vue'

const { messages, isLoading, hasMessages, send, clearChat } = useStreamingChat()

const scrollEl = ref<HTMLElement | null>(null)

async function scrollToBottom() {
  await nextTick()
  if (scrollEl.value) {
    scrollEl.value.scrollTop = scrollEl.value.scrollHeight
  }
}

watch(messages, scrollToBottom, { deep: true })

async function handleSend(text: string) {
  await send(text)
}
</script>

<template>
  <div class="flex flex-col h-full bg-gray-50">
    <!-- Header -->
    <header class="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shadow-sm">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow">
          <Icon icon="mdi:robot-excited" class="text-white text-xl" />
        </div>
        <div>
          <h1 class="font-semibold text-gray-900 text-sm">Travel Assistant</h1>
          <p class="text-xs text-emerald-500 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Online
          </p>
        </div>
      </div>
      <button
        v-if="hasMessages"
        class="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        title="Clear chat"
        @click="clearChat"
      >
        <Icon icon="mdi:trash-can-outline" class="text-lg" />
      </button>
    </header>

    <!-- Messages -->
    <div ref="scrollEl" class="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      <!-- Welcome state -->
      <div v-if="!hasMessages" class="flex flex-col items-center justify-center h-full text-center px-4">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg mb-4">
          <Icon icon="mdi:airplane" class="text-white text-3xl" />
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-1">Where to next?</h2>
        <p class="text-sm text-gray-500 max-w-xs">
          Tell me your destination, dates, budget, and preferences — I'll find the perfect hotel for you.
        </p>
        <QuickReplies @select="handleSend" />
      </div>

      <!-- Message list -->
      <template v-else>
        <MessageBubble
          v-for="msg in messages"
          :key="msg.id"
          :message="msg"
        />
      </template>
    </div>

    <!-- Input -->
    <ChatInput :disabled="isLoading" @send="handleSend" />
  </div>
</template>
