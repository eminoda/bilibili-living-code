<script setup lang="ts">
import type { ChatStatus, UIMessage } from '~/types/chat'
import { getMessageText } from '~/types/chat'
import ChatComposer from '~/components/chat/ChatComposer.vue'
import MessageList from '~/components/chat/MessageList.vue'

const props = defineProps<{
  messages: UIMessage[]
  status: ChatStatus
  errorMessage: string | null
  isSubmitting: boolean
  isLoading: boolean
  isStreaming: boolean
  canRetry: boolean
  wasAborted: boolean
  legacySubmitting: boolean
}>()

const input = defineModel<string>('input', { required: true })

const emit = defineEmits<{
  send: []
  sendLegacy: []
  stop: []
  retry: []
  retryStream: [messageId?: string]
  exampleSelect: [question: string]
}>()

const mainContentRef = ref<HTMLElement | null>(null)

const exampleQuestions = [
  '解释一下 JavaScript 中 async/await 的工作原理',
  'Vue 和 React 的主要区别是什么？',
  '帮我写一段简洁的产品介绍',
]

function handleExampleClick(question: string) {
  emit('exampleSelect', question)
}

async function scrollToBottom() {
  await nextTick()
  const container = mainContentRef.value
  if (!container) return
  container.scrollTop = container.scrollHeight
}

watch(
  () => [
    props.messages.length,
    props.status,
    props.messages.at(-1) ? getMessageText(props.messages.at(-1)!) : '',
  ] as const,
  () => {
    if (props.messages.length > 0) {
      scrollToBottom()
    }
  },
)
</script>

<template>
  <div class="chat-shell" data-testid="chat-shell">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h1 class="app-name">对话</h1>
        <button type="button" class="new-chat-button">
          + 新建对话
        </button>
      </div>
      <div class="history-placeholder">
        <p class="history-label">最近</p>
        <p class="history-empty">暂无对话记录</p>
      </div>
    </aside>

    <main class="main">
      <header class="main-header">
        <span class="main-title">对话</span>
      </header>

      <div ref="mainContentRef" class="main-content">
        <div
          v-if="messages.length === 0"
          class="empty-state"
          data-testid="empty-state"
        >
          <h2 class="welcome-title">有什么可以帮你的？</h2>
          <p class="welcome-subtitle">
            直接提问，或试试下面的示例。
          </p>
          <ul class="example-list">
            <li v-for="question in exampleQuestions" :key="question">
              <button
                type="button"
                class="example-button"
                @click="handleExampleClick(question)"
              >
                {{ question }}
              </button>
            </li>
          </ul>
        </div>

        <MessageList
          v-else
          :messages="messages"
          :loading="isLoading"
          :streaming="isStreaming"
          :status="status"
          :was-aborted="wasAborted"
          @retry="emit('retryStream', $event)"
        />
      </div>

      <div v-if="errorMessage" class="error-banner">
        <span>{{ errorMessage }}</span>
        <button
          v-if="canRetry"
          type="button"
          class="retry-button"
          data-testid="retry-button"
          @click="emit('retry')"
        >
          重新发送
        </button>
      </div>

      <footer class="composer-footer">
        <div class="composer-wrapper">
          <ChatComposer
            v-model="input"
            :disabled="isSubmitting"
            :loading="isLoading"
            :streaming="isStreaming"
            :legacy-submitting="legacySubmitting"
            @send="emit('send')"
            @send-legacy="emit('sendLegacy')"
            @stop="emit('stop')"
          />
        </div>
      </footer>
    </main>
  </div>
</template>

<style scoped>
.chat-shell {
  display: flex;
  height: 100dvh;
  overflow: hidden;
  color: #0d0d0d;
  background: #fff;
}

.sidebar {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  width: 13.5rem;
  padding: 0.75rem;
  background: #f9f9f9;
  border-right: 1px solid #e5e5e5;
}

.sidebar-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-bottom: 0.75rem;
}

.app-name {
  margin: 0;
  padding: 0.5rem 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
}

.new-chat-button {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e5e5;
  border-radius: 0.625rem;
  font-size: 0.875rem;
  color: #0d0d0d;
  background: #fff;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s ease;
}

.new-chat-button:hover {
  background: #f0f0f0;
}

.history-placeholder {
  flex: 1;
  padding-top: 0.5rem;
}

.history-label {
  margin: 0 0 0.5rem;
  padding: 0 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #8e8e8e;
  letter-spacing: 0.04em;
}

.history-empty {
  margin: 0;
  padding: 0.5rem 0.25rem;
  font-size: 0.8125rem;
  color: #8e8e8e;
}

.main {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  background: #fff;
}

.main-header {
  display: none;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 3rem;
  border-bottom: 1px solid #e5e5e5;
}

.main-title {
  font-size: 0.9375rem;
  font-weight: 500;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem 1.5rem 1rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  max-width: 40rem;
  margin: 0 auto;
  text-align: center;
}

.welcome-title {
  margin: 0 0 0.5rem;
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.welcome-subtitle {
  margin: 0 0 2rem;
  font-size: 0.9375rem;
  color: #6e6e6e;
}

.example-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}

.example-button {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #e5e5e5;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  color: #0d0d0d;
  background: #fff;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s ease;
}

.example-button:hover {
  background: #f7f7f7;
}

.error-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  flex-shrink: 0;
  margin: 0;
  padding: 0.5rem 1.5rem;
  font-size: 0.875rem;
  color: #b42318;
  text-align: center;
  background: #fef3f2;
}

.retry-button {
  padding: 0.25rem 0.75rem;
  border: 1px solid #fecdca;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  color: #b42318;
  background: #fff;
  cursor: pointer;
  transition: background 0.15s ease;
}

.retry-button:hover {
  background: #fff6f5;
}

.composer-footer {
  flex-shrink: 0;
  padding: 0 1.5rem 1.5rem;
  background: linear-gradient(to top, #fff 70%, rgb(255 255 255 / 0%));
}

.composer-wrapper {
  max-width: 48rem;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }

  .main-header {
    display: flex;
  }

  .main-content {
    padding: 1.5rem 1rem 0.75rem;
  }

  .welcome-title {
    font-size: 1.375rem;
  }

  .composer-footer {
    padding: 0 1rem 1rem;
  }

  .error-banner {
    padding: 0.5rem 1rem;
  }
}

@media (min-width: 1280px) {
  .main-content {
    padding: 2.5rem 2rem 1rem;
  }
}
</style>
