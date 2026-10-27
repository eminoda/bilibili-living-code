export type Implementation = 'vueuse' | 'native'

export interface ApplicationForm {
  company: string
  contact: string
  category: string
  amount: number | null
  note: string
  unifiedCode?: string
  registeredAddress?: string
  businessScope?: string
  contactPhone?: string
  projectName?: string
  budgetSource?: string
  expectedDate?: string
  legalRepresentative?: string
  companySize?: string
  contactEmail?: string
  projectLocation?: string
  expectedUsers?: number | null
  implementationCycle?: string
  cooperationMode?: string
  preparedMaterials?: string[]
  province?: string
  city?: string
  district?: string
  serviceOffice?: string
}

export interface Product {
  id: number
  sku: string
  name: string
  category: string
  price: number
  stock: number
  discount: number
}

export interface ProductResult extends Product {
  valid: boolean
  issue: string
}

export interface ProductValidationSummary {
  total: number
  validCount: number
  invalidCount: number
  preview: ProductResult[]
}
