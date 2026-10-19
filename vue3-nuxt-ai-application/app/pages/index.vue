<script setup lang="ts">
import ChatShell from '~/components/chat/ChatShell.vue'

const {
  messages,
  input,
  status,
  errorMessage,
  isSubmitting,
  isLoading,
  isStreaming,
  canRetry,
  wasAborted,
  legacySubmitting,
  send,
  sendLegacy,
  stop,
  retry,
  retryStream,
  setInput,
} = useChat()
</script>

<template>
  <ChatShell
    v-model:input="input"
    :messages="messages"
    :status="status"
    :error-message="errorMessage"
    :is-submitting="isSubmitting"
    :is-loading="isLoading"
    :is-streaming="isStreaming"
    :can-retry="canRetry"
    :was-aborted="wasAborted"
    :legacy-submitting="legacySubmitting"
    @send="send"
    @send-legacy="sendLegacy"
    @stop="stop"
    @retry="retry"
    @retry-stream="retryStream"
    @example-select="setInput"
  />
</template>
