<script setup lang="ts">
import type { ChatStatus, UIMessage } from '~/types/chat'
import { getMessageText } from '~/types/chat'
import MarkdownContent from '~/components/chat/MarkdownContent.vue'

const props = defineProps<{
  messages: UIMessage[]
  loading?: boolean
  streaming?: boolean
  status?: ChatStatus
  wasAborted?: boolean
}>()

const emit = defineEmits<{
  retry: [messageId?: string]
}>()

function textOf(message: UIMessage) {
  return getMessageText(message)
}

function isLastAssistant(message: UIMessage) {
  for (let i = props.messages.length - 1; i >= 0; i--) {
    const candidate = props.messages[i]
    if (candidate?.role === 'assistant') {
      return candidate.id === message.id
    }
  }
  return false
}

function showStopped(message: UIMessage) {
  return message.role === 'assistant'
    && !!props.wasAborted
    && isLastAssistant(message)
    && props.status === 'ready'
}

function showError(message: UIMessage) {
  return message.role === 'assistant'
    && props.status === 'error'
    && isLastAssistant(message)
}

function showStreamingPlaceholder(message: UIMessage) {
  return message.role === 'assistant'
    && !!props.streaming
    && isLastAssistant(message)
    && !textOf(message)
}
</script>

<template>
  <div class="message-list" data-testid="message-list">
    <div
      v-for="message in messages"
      :key="message.id"
      class="message-row"
      :class="message.role === 'user' ? 'message-row--user' : 'message-row--assistant'"
      :data-testid="message.role === 'assistant' ? 'assistant-message' : undefined"
    >
      <div class="message-inner">
        <template v-for="(part, index) in message.parts" :key="`${message.id}-${part.type}-${index}`">
          <MarkdownContent
            v-if="message.role === 'assistant' && part.type === 'text' && part.text"
            :content="part.text"
          />
          <p
            v-else-if="message.role === 'user' && part.type === 'text' && part.text"
            class="message-content"
          >
            {{ part.text }}
          </p>
        </template>

        <p
          v-if="showStreamingPlaceholder(message)"
          class="message-content message-content--placeholder"
        >
          正在生成回复...
        </p>

        <div
          v-if="showStopped(message)"
          class="message-feedback"
          data-testid="stopped-feedback"
        >
          <span class="message-feedback-text">已停止生成</span>
          <button
            type="button"
            class="message-action-button"
            data-testid="message-retry-button"
            @click="emit('retry', message.id)"
          >
            重试
          </button>
        </div>

        <div
          v-else-if="showError(message)"
          class="message-feedback message-feedback--error"
          data-testid="error-feedback"
        >
          <span class="message-feedback-text">生成失败，请重试</span>
          <button
            type="button"
            class="message-action-button message-action-button--error"
            data-testid="message-retry-button"
            @click="emit('retry', message.id)"
          >
            重试
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading && !streaming" class="message-row message-row--assistant loading-row" data-testid="loading-indicator">
      <div class="message-inner">
        <p class="message-content message-content--loading">正在生成回复...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 48rem;
  margin: 0 auto;
}

.message-row {
  display: flex;
  width: 100%;
}

.message-row--assistant .message-inner {
  width: 100%;
}

.message-row--user {
  justify-content: flex-end;
}

.message-row--user .message-inner {
  max-width: 85%;
  padding: 0.625rem 1rem;
  background: #f4f4f4;
  border-radius: 1.25rem;
}

.message-row--user .message-content {
  line-height: 1.5;
  color: #0d0d0d;
  white-space: pre-wrap;
  word-break: break-word;
}

.message-content {
  margin: 0;
  font-size: 0.9375rem;
}

.message-content--loading,
.message-content--placeholder {
  color: #8e8e8e;
  font-style: italic;
}

.message-feedback {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.message-feedback-text {
  font-size: 0.8125rem;
  color: #8e8e8e;
}

.message-feedback--error .message-feedback-text {
  color: #b42318;
}

.message-action-button {
  padding: 0.25rem 0.75rem;
  border: 1px solid #e5e5e5;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  color: #0d0d0d;
  background: #fff;
  cursor: pointer;
  transition: background 0.15s ease;
}

.message-action-button:hover {
  background: #f7f7f7;
}

.message-action-button--error {
  border-color: #fecdca;
  color: #b42318;
}

.message-action-button--error:hover {
  background: #fff6f5;
}

.loading-row .message-inner::after {
  content: '';
  display: inline-block;
  width: 0.375rem;
  height: 0.375rem;
  margin-left: 0.25rem;
  border-radius: 50%;
  background: #8e8e8e;
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
</style>
