import { computed, shallowRef, watch } from 'vue'
import type { Implementation } from '@/types'

const storageKey = 'vue3-vueuse-business-practice-implementation'
const mode = shallowRef<Implementation>(
  typeof localStorage === 'undefined' || localStorage.getItem(storageKey) !== 'native'
    ? 'vueuse'
    : 'native',
)

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === storageKey) {
      mode.value = event.newValue === 'native' ? 'native' : 'vueuse'
    }
  })
  watch(mode, (value) => localStorage.setItem(storageKey, value), { flush: 'sync' })
}

export function useImplementationMode() {
  const isVueUse = computed(() => mode.value === 'vueuse')
  return { mode, isVueUse }
}
