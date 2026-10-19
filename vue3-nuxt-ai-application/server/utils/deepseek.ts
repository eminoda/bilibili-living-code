import { createDeepSeek, type DeepSeekProvider } from '@ai-sdk/deepseek'

export function getDeepSeekConfig() {
  const config = useRuntimeConfig()
  const apiKey = config.deepseekApiKey
  const baseURL = config.deepseekBaseUrl
  const model = config.deepseekModel

  if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) {
    throw createError({
      statusCode: 500,
      statusMessage: 'DeepSeek configuration error',
      message: 'DeepSeek API key is not configured. Set NUXT_DEEPSEEK_API_KEY in your environment.',
    })
  }

  if (!baseURL || typeof baseURL !== 'string' || !baseURL.trim()) {
    throw createError({
      statusCode: 500,
      statusMessage: 'DeepSeek configuration error',
      message: 'DeepSeek base URL is not configured. Set NUXT_DEEPSEEK_BASE_URL in your environment.',
    })
  }

  if (!model || typeof model !== 'string' || !model.trim()) {
    throw createError({
      statusCode: 500,
      statusMessage: 'DeepSeek configuration error',
      message: 'DeepSeek model is not configured. Set NUXT_DEEPSEEK_MODEL in your environment.',
    })
  }

  return {
    apiKey,
    baseURL,
    model,
  }
}

export function createDeepSeekProvider(): DeepSeekProvider {
  const { apiKey, baseURL } = getDeepSeekConfig()

  return createDeepSeek({
    apiKey,
    baseURL,
  })
}

export function getDeepSeekModelId(): string {
  return getDeepSeekConfig().model
}
