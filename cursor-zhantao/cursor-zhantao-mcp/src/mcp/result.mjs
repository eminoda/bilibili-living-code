function toText(data) {
  return {
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
  }
}

export async function runTool(handler, args) {
  try {
    return toText(await handler(args ?? {}))
  } catch (error) {
    return {
      isError: true,
      content: [{
        type: 'text',
        text: error instanceof Error ? error.message : String(error),
      }],
    }
  }
}
