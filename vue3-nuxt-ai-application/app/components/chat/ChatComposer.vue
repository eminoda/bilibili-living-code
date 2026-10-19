<script setup lang="ts">
const model = defineModel<string>({ default: '' })

const props = defineProps<{
  disabled?: boolean
  loading?: boolean
  streaming?: boolean
  legacySubmitting?: boolean
}>()

const emit = defineEmits<{
  send: []
  sendLegacy: []
  stop: []
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)

const isInputDisabled = computed(() => props.disabled || props.loading || props.streaming || props.legacySubmitting)
const isSendDisabled = computed(() => isInputDisabled.value || !model.value.trim())

function adjustHeight() {
  const textarea = textareaRef.value
  if (!textarea) return

  textarea.style.height = 'auto'
  textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`
}

function handleSend() {
  if (isSendDisabled.value) return
  emit('send')
}

function handleSendLegacy() {
  if (isSendDisabled.value) return
  emit('sendLegacy')
}

function handleStop() {
  emit('stop')
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSend()
  }
}

watch(model, async () => {
  await nextTick()
  adjustHeight()
})

onMounted(() => {
  adjustHeight()
})
</script>

<template>
  <div class="chat-composer">
    <div class="composer-box">
      <textarea
        id="chat-input"
        ref="textareaRef"
        v-model="model"
        class="chat-input"
        data-testid="chat-input"
        placeholder="输入消息..."
        rows="1"
        :disabled="isInputDisabled"
        @keydown="handleKeydown"
      />
      <div class="composer-actions">
        <button
          id="legacy-send-button"
          type="button"
          class="send-button send-button--legacy"
          data-testid="legacy-send-button"
          :disabled="isSendDisabled || streaming"
          @click="handleSendLegacy"
        >
          {{ legacySubmitting ? '发送中...' : '发送' }}
        </button>
        <button
          v-if="streaming"
          id="stop-button"
          type="button"
          class="send-button send-button--stop"
          data-testid="stop-button"
          @click="handleStop"
        >
          停止
        </button>
        <button
          v-else
          id="send-button"
          type="button"
          class="send-button"
          data-testid="send-button"
          :disabled="isSendDisabled"
          @click="handleSend"
        >
          {{ loading ? '发送中...' : '流式发送' }}
        </button>
      </div>
    </div>
    <p class="composer-hint">按 Enter 流式发送，Shift+Enter 换行；灰色按钮为普通 HTTP 对照</p>
  </div>
</template>

<style scoped>
.chat-composer {
  width: 100%;
}

.composer-box {
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 1.5rem;
  box-shadow: 0 1px 4px rgb(0 0 0 / 6%);
}

.chat-input {
  flex: 1;
  min-height: 1.5rem;
  max-height: 8rem;
  padding: 0.25rem 0;
  border: none;
  outline: none;
  resize: none;
  overflow-y: auto;
  font-family: inherit;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: #0d0d0d;
  background: transparent;
}

.chat-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.chat-input::placeholder {
  color: #8e8e8e;
}

.composer-actions {
  display: flex;
  flex-shrink: 0;
  gap: 0.5rem;
}

.send-button {
  flex-shrink: 0;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #fff;
  background: #0d0d0d;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.send-button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.send-button:not(:disabled):hover {
  opacity: 0.85;
}

.send-button--legacy {
  border: 1px solid #e5e5e5;
  color: #8e8e8e;
  background: #f5f5f5;
  transition: background 0.15s ease, color 0.15s ease;
}

.send-button--legacy:not(:disabled):hover {
  opacity: 1;
  color: #6e6e6e;
  background: #ebebeb;
}

.send-button--stop {
  background: #b42318;
}

.send-button--stop:hover {
  opacity: 0.9;
}

.composer-hint {
  margin: 0.5rem 0 0;
  font-size: 0.75rem;
  color: #8e8e8e;
  text-align: center;
}
</style>
