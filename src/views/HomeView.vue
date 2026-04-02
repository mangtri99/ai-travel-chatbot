<script setup lang="ts">
import ChatWindow from '@/components/chat/ChatWindow.vue'
import ItineraryModal from '@/components/itinerary/ItineraryModal.vue'
import CompareBar from '@/components/hotel/CompareBar.vue'
import CompareModal from '@/components/hotel/CompareModal.vue'
</script>

<template>
  <main class="h-screen w-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center p-4">
    <div class="w-full max-w-2xl h-full max-h-[760px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-gray-200/60">
      <ChatWindow />
    </div>
  </main>
  <ItineraryModal />
  <CompareBar />
  <CompareModal />
</template>
