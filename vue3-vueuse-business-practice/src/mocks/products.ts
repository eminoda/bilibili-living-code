import type { Product, ProductResult, ProductValidationSummary } from '@/types'
import productsUrl from './products.data.json?url'

// Static fixture: 300,000 product rows shared by the native and Worker demos.
export const mockProductCount = 300_000
export const productDataUrl = productsUrl

export async function loadAndValidateProducts(url: string): Promise<ProductValidationSummary> {
  const response = await fetch(url)
  if (!response.ok) throw new Error('商品样例数据读取失败')
  const products = await response.json() as Product[]
  const results = validateProducts(products)
  let invalidCount = 0
  const preview: ProductResult[] = []
  for (const result of results) {
    if (!result.valid) invalidCount += 1
    if (preview.length < 8) preview.push(result)
  }
  return {
    total: results.length,
    validCount: results.length - invalidCount,
    invalidCount,
    preview,
  }
}

// Keep this function self-contained so useWebWorkerFn can serialize it into a Worker.
export function validateProducts(products: Product[]): ProductResult[] {
  const seen = new Set<string>()
  const skuPattern = /^SKU-\d{6}$/
  const allowedCategories = new Set(['数码设备', '办公用品', '家居生活', '户外装备'])
  return products.map((product) => {
    const issues: string[] = []
    const normalizedSku = product.sku.trim().toUpperCase()
    const normalizedName = product.name.normalize('NFKC').trim()
    if (!skuPattern.test(normalizedSku)) issues.push('编号格式异常')
    if (seen.has(product.sku)) issues.push('商品编号重复')
    if (product.price <= 0 || !Number.isFinite(product.price)) issues.push('价格无效')
    if (!Number.isInteger(product.stock) || product.stock < 0) issues.push('库存不能为负数')
    if (product.discount < 0 || product.discount > 0.8) issues.push('折扣超出范围')
    if (!allowedCategories.has(product.category)) issues.push('商品分类不存在')
    if (normalizedName.length < 3) issues.push('商品名称过短')
    seen.add(product.sku)
    return {
      ...product,
      sku: normalizedSku,
      name: normalizedName,
      valid: issues.length === 0,
      issue: issues.join('、'),
    }
  })
}
