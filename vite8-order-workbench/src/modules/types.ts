export interface BusinessModuleDefinition {
  slug: string
  title: string
  group: string
  domain: 'orders' | 'fulfillment' | 'inventory' | 'customers' | 'finance' | 'analytics'
  description: string
  owner: string
  metricLabel: string
  metricValue: string
  change: string
  columns: [string, string, string]
  category: string
}

export interface BusinessModuleAccess {
  role: string
  scope: string
  reviewCycle: string
}
