<script setup lang="ts">
defineProps<{
  text: string
  isStreaming?: boolean
}>()
</script>

<template>
  <span>
    {{ text }}<span v-if="isStreaming" class="inline-block w-0.5 h-4 bg-current ml-0.5 align-middle animate-pulse" />
  </span>
</template>
