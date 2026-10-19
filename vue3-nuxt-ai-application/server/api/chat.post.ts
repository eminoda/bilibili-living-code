import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from 'ai'
import { createDeepSeekProvider, getDeepSeekModelId } from '../utils/deepseek'

function toSafeClientErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return 'Chat stream failed'
  }

  const candidate = error as {
    statusCode?: number
    status?: number
    message?: string
    name?: string
    code?: string
  }

  const status = candidate.statusCode ?? candidate.status
  const message = typeof candidate.message === 'string' ? candidate.message : ''

  if (message.includes('not configured')) {
    return message
  }

  if (status === 400) {
    return 'Invalid request'
  }

  if (status === 401 || status === 403) {
    return 'Authentication failed'
  }

  if (status === 429) {
    return 'Rate limit exceeded'
  }

  if (typeof status === 'number' && status >= 500) {
    return 'Upstream service error'
  }

  const lowered = message.toLowerCase()
  const name = typeof candidate.name === 'string' ? candidate.name.toLowerCase() : ''
  const code = typeof candidate.code === 'string' ? candidate.code.toLowerCase() : ''

  if (name.includes('abort') || lowered.includes('aborted') || code.includes('abort')) {
    return 'Request aborted'
  }

  if (
    name.includes('timeout')
    || lowered.includes('timeout')
    || code.includes('timeout')
    || code === 'etimedout'
  ) {
    return 'Upstream timeout'
  }

  return 'Chat stream failed'
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body || typeof body !== 'object') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid request body',
    })
  }

  const { messages } = body as { messages?: unknown }

  if (!Array.isArray(messages) || messages.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'messages is required',
    })
  }

  const uiMessages = messages as UIMessage[]
  const deepseek = createDeepSeekProvider()
  const modelId = getDeepSeekModelId()

  try {
    const result = streamText({
      model: deepseek(modelId),
      messages: await convertToModelMessages(uiMessages),
      providerOptions: {
        deepseek: {
          thinking: { type: 'disabled' },
        },
      },
    })

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: result.stream,
        onError: toSafeClientErrorMessage,
      }),
    })
  }
  catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Chat stream failed',
      message: toSafeClientErrorMessage(error),
    })
  }
})
