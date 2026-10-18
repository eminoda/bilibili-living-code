export interface DemoItem {
  id: number
  title: string
  description: string
  color: 'lilac' | 'blue' | 'peach' | 'mint' | 'yellow'
}

export type ListAction = 'shuffle' | 'reverse' | 'reset'
