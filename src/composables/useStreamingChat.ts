import { computed } from 'vue'
import { useChatStore } from '@/stores/chatStore'

export function useStreamingChat() {
  const store = useChatStore()

  const hasMessages = computed(() => store.messages.length > 0)
  const lastMessage = computed(() => store.messages[store.messages.length - 1])
  const isAssistantStreaming = computed(
    () => lastMessage.value?.role === 'assistant' && lastMessage.value?.isStreaming,
  )

  async function send(message: string) {
    await store.sendMessage(message)
  }

  return {
    messages: computed(() => store.messages),
    isLoading: computed(() => store.isLoading),
    hasMessages,
    isAssistantStreaming,
    send,
    clearChat: store.clearChat,
  }
}
