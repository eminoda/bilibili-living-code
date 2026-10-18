import { shallowRef } from 'vue'
import type { CustomerRow } from '../types'

const rowCount = 100_000
const givenNames = ['张伟', '李娜', '王强', '刘洋', '陈静', '杨帆', '赵敏', '黄磊', '周婷', '吴昊']
const regions = ['上海', '北京', '深圳', '杭州', '成都', '广州', '南京', '武汉']
const sources = ['官网', '活动', '导入', '线下门店', '合作渠道']
const phonePrefixes = ['138', '139', '136', '137', '150', '186']

function createCustomers(): { rows: CustomerRow[]; errorCount: number } {
  let errorCount = 0
  const rows = Array.from({ length: rowCount }, (_, index) => {
    const id = index + 1
    const status: CustomerRow['status'] = id % 97 === 3 ? '异常' : '正常'
    if (status === '异常') errorCount += 1

    return {
      id: String(id).padStart(6, '0'),
      name: givenNames[index % givenNames.length]!,
      phone: `${phonePrefixes[index % phonePrefixes.length]}****${String((id * 37) % 10_000).padStart(4, '0')}`,
      region: regions[index % regions.length]!,
      source: sources[index % sources.length]!,
      status,
    }
  })

  return { rows, errorCount }
}

const generated = createCustomers()

export function useCustomerData() {
  return {
    rows: shallowRef(generated.rows),
    errorCount: generated.errorCount,
  }
}
