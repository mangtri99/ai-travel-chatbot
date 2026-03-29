import { ref } from 'vue'

const SESSION_KEY = 'travel_chat_session_id'

function getOrCreateSessionId(): string {
  const stored = sessionStorage.getItem(SESSION_KEY)
  if (stored) return stored
  const id = crypto.randomUUID()
  sessionStorage.setItem(SESSION_KEY, id)
  return id
}

export function useChatSession() {
  const sessionId = ref(getOrCreateSessionId())

  function resetSession() {
    const id = crypto.randomUUID()
    sessionStorage.setItem(SESSION_KEY, id)
    sessionId.value = id
  }

  return { sessionId, resetSession }
}
