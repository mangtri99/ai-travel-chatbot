import { ref, onUnmounted } from 'vue'

const isSpeechRecognitionSupported =
  typeof window !== 'undefined' &&
  ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

const isSpeechSynthesisSupported =
  typeof window !== 'undefined' && 'speechSynthesis' in window

export function useVoice() {
  const isListening = ref(false)
  const isSpeaking = ref(false)
  const interimTranscript = ref('')

  let recognition: SpeechRecognition | null = null

  // ── Speech-to-Text ──────────────────────────────────────────────

  function startListening(
    onInterim: (text: string) => void,
    onFinal: (text: string) => void,
  ) {
    if (!isSpeechRecognitionSupported || isListening.value) return

    const SR = (window.SpeechRecognition ?? (window as Window & { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition)!
    recognition = new SR()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = navigator.language || 'en-US'

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let interim = ''
      let final = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results.item(i)
        if (!result) continue
        const t = result.item(0)?.transcript ?? ''
        if (result.isFinal) final += t
        else interim += t
      }
      interimTranscript.value = final || interim
      onInterim(interimTranscript.value)
      if (final) onFinal(final.trim())
    }

    recognition.onerror = () => {
      isListening.value = false
      interimTranscript.value = ''
    }

    recognition.onend = () => {
      isListening.value = false
      interimTranscript.value = ''
    }

    recognition.start()
    isListening.value = true
  }

  function stopListening() {
    recognition?.stop()
    isListening.value = false
    interimTranscript.value = ''
  }

  // ── Text-to-Speech ──────────────────────────────────────────────

  function speak(text: string) {
    if (!isSpeechSynthesisSupported || !text.trim()) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = navigator.language || 'en-US'
    utterance.onstart = () => (isSpeaking.value = true)
    utterance.onend = () => (isSpeaking.value = false)
    utterance.onerror = () => (isSpeaking.value = false)
    window.speechSynthesis.speak(utterance)
  }

  function stopSpeaking() {
    window.speechSynthesis.cancel()
    isSpeaking.value = false
  }

  onUnmounted(() => {
    stopListening()
    stopSpeaking()
  })

  return {
    isListening,
    isSpeaking,
    interimTranscript,
    sttSupported: isSpeechRecognitionSupported,
    ttsSupported: isSpeechSynthesisSupported,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  }
}
