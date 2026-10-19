import type { UIMessage } from 'ai'

export type { UIMessage }

export type ChatStatus = 'submitted' | 'streaming' | 'ready' | 'error'

export interface LegacyChatApiRequest {
  prompt: string
}

export interface LegacyChatApiResponse {
  message: string
}

export function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: 'text', text: string } => part.type === 'text')
    .map(part => part.text)
    .join('')
}
