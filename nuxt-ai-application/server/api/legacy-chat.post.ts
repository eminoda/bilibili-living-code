export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body || typeof body !== 'object' || !('prompt' in body)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'prompt is required',
    })
  }

  const prompt = body.prompt

  if (typeof prompt !== 'string' || !prompt.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'prompt must be a non-empty string',
    })
  }

  await new Promise(resolve => setTimeout(resolve, 800))

  return {
    message: '因为 Nuxt 保留了 Vue 的开发体验，同时提供 server/api 这样的服务端能力。我们可以从熟悉的页面出发，逐步走进 AI Application。',
  }
})
