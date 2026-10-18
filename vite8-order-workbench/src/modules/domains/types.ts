import type { BusinessModuleAccess, BusinessModuleDefinition } from '../types'
import type { BusinessRow } from '../createBusinessRows'

export interface DomainWorkbenchProps {
  definition: BusinessModuleDefinition
  access: BusinessModuleAccess
  rows: BusinessRow[]
}

export interface DomainMetric {
  label: string
  value: string
  detail: string
  tone: 'blue' | 'orange' | 'green' | 'red'
}

export interface DomainStep {
  title: string
  detail: string
  state: 'done' | 'active' | 'waiting'
}

export interface DomainWorkflow {
  title: string
  description: string
  metrics: DomainMetric[]
  steps: DomainStep[]
  task: { count: string; title: string; note: string; tone: string; path: string }
  activity: { time: string; title: string; note: string }
}
