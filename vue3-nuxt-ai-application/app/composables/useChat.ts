import { DefaultChatTransport } from 'ai'
import { useChat as useAiChat } from '@ai-sdk/vue'
import type { LegacyChatApiRequest, LegacyChatApiResponse, UIMessage } from '~/types/chat'

function toSafeClientError(error: unknown): string {
  if (error instanceof Error && error.message) {
    const message = error.message
    if (/api[_-]?key|authorization|bearer/i.test(message)) {
      return '请求失败，请稍后重试'
    }
    return message
  }
  return '请求失败，请稍后重试'
}

function cloneMessages(messages: UIMessage[]): UIMessage[] {
  // New array/part references so child props change on every stream tick.
  // @ai-sdk/vue keeps messages in a shallowRef; mutating the same array would
  // otherwise let Vue skip ChatShell/MessageList updates until status flips.
  return messages.map(message => ({
    ...message,
    parts: message.parts.map(part => ({ ...part })),
  })) as UIMessage[]
}

export function useChat() {
  const input = ref('')
  const wasAborted = ref(false)
  const legacySubmitting = ref(false)
  const legacyErrorMessage = ref<string | null>(null)

  const {
    messages: aiMessages,
    status,
    error,
    sendMessage,
    stop,
    regenerate,
    clearError,
  } = useAiChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    onFinish: ({ isAbort }) => {
      wasAborted.value = isAbort
    },
    onError: () => {
      wasAborted.value = false
    },
  })

  const messages = computed(() => cloneMessages(aiMessages.value))

  const isStreaming = computed(() => status.value === 'streaming')
  const isLoading = computed(() => status.value === 'submitted')
  const isSubmitting = computed(() => isLoading.value || isStreaming.value || legacySubmitting.value)
  const canSend = computed(() => input.value.trim().length > 0 && !isSubmitting.value)
  const errorMessage = computed(() => {
    if (legacyErrorMessage.value) return legacyErrorMessage.value
    if (status.value !== 'error' || !error.value) return null
    return toSafeClientError(error.value)
  })
  const canRetry = computed(() => {
    if (legacyErrorMessage.value && !isSubmitting.value) return true
    return status.value === 'error' && !isSubmitting.value
  })

  async function send() {
    const content = input.value.trim()
    if (!content || isSubmitting.value) return

    legacyErrorMessage.value = null
    wasAborted.value = false
    clearError()
    input.value = ''

    await sendMessage({ text: content })
  }

  async function sendLegacy() {
    const content = input.value.trim()
    if (!content || isSubmitting.value) return

    legacySubmitting.value = true
    legacyErrorMessage.value = null
    clearError()

    try {
      const response = await fetch('/api/legacy-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: content } satisfies LegacyChatApiRequest),
      })

      if (!response.ok) {
        throw new Error('普通发送失败，请稍后重试')
      }

      const data = await response.json() as LegacyChatApiResponse
      if (typeof data.message !== 'string' || !data.message.trim()) {
        throw new Error('普通发送失败，请稍后重试')
      }

      aiMessages.value = [
        ...aiMessages.value,
        {
          id: crypto.randomUUID(),
          role: 'user',
          parts: [{ type: 'text', text: content }],
        },
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          parts: [{ type: 'text', text: data.message.trim() }],
        },
      ]
      input.value = ''
    }
    catch (err) {
      legacyErrorMessage.value = toSafeClientError(err)
    }
    finally {
      legacySubmitting.value = false
    }
  }

  async function handleStop() {
    await stop()
  }

  async function retry() {
    if (legacyErrorMessage.value) {
      legacyErrorMessage.value = null
      return
    }

    if (status.value !== 'error') return
    clearError()
    wasAborted.value = false
    await regenerate()
  }

  async function retryStream(messageId?: string) {
    legacyErrorMessage.value = null
    clearError()
    wasAborted.value = false
    await regenerate(messageId ? { messageId } : undefined)
  }

  function setInput(value: string) {
    input.value = value
  }

  return {
    messages,
    input,
    status,
    errorMessage,
    isSubmitting,
    isLoading,
    isStreaming,
    canSend,
    canRetry,
    wasAborted,
    legacySubmitting,
    send,
    sendLegacy,
    stop: handleStop,
    retry,
    retryStream,
    setInput,
  }
}
