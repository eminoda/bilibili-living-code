export type CustomerStatus = '正常' | '异常'

export interface CustomerRow {
  id: string
  name: string
  phone: string
  region: string
  source: string
  status: CustomerStatus
}

export type RenderMode = 'standard' | 'virtual'

/** URL ?mode=1|2|3 对应的演示场景 */
export type DemoMode = RenderMode | 'comments'
