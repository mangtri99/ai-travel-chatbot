import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Message } from '@/types'
import { streamChat } from '@/services/chatApi'

export const useChatStore = defineStore('chat', () => {
  const messages = ref<Message[]>([])
  const isLoading = ref(false)
  const sessionId = ref(crypto.randomUUID())

  let abortController: AbortController | null = null

  function addMessage(msg: Omit<Message, 'id' | 'timestamp'>): Message {
    const message: Message = {
      ...msg,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    }
    messages.value.push(message)
    return message
  }

  async function sendMessage(userText: string) {
    if (isLoading.value || !userText.trim()) return

    addMessage({ role: 'user', content: userText.trim() })

    const assistantMsg = addMessage({
      role: 'assistant',
      content: '',
      isStreaming: true,
    })

    isLoading.value = true
    abortController = new AbortController()

    try {
      await streamChat(
        userText,
        sessionId.value,
        (chunk) => {
          const msg = messages.value.find((m) => m.id === assistantMsg.id)
          if (!msg) return

          if (chunk.type === 'text' && chunk.content) {
            msg.content += chunk.content
          } else if (chunk.type === 'hotels' && chunk.hotels) {
            msg.hotels = chunk.hotels
          } else if (chunk.type === 'done') {
            msg.isStreaming = false
            isLoading.value = false
          } else if (chunk.type === 'error') {
            msg.content = chunk.error || 'Something went wrong. Please try again.'
            msg.isStreaming = false
            isLoading.value = false
          }
        },
        abortController.signal,
      )
    } catch (err: unknown) {
      const msg = messages.value.find((m) => m.id === assistantMsg.id)
      if (msg) {
        if (err instanceof Error && err.name !== 'AbortError') {
          msg.content = 'Sorry, I encountered an error. Please try again.'
        }
        msg.isStreaming = false
      }
    } finally {
      isLoading.value = false
      const msg = messages.value.find((m) => m.id === assistantMsg.id)
      if (msg) msg.isStreaming = false
    }
  }

  function clearChat() {
    abortController?.abort()
    messages.value = []
    sessionId.value = crypto.randomUUID()
    isLoading.value = false
  }

  return { messages, isLoading, sessionId, sendMessage, clearChat }
})
