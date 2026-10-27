import { computed, shallowRef, type Ref } from 'vue'
import { useDebouncedRefHistory, useRefHistory } from '@vueuse/core'
import type { ApplicationForm, Implementation } from '@/types'

export function useApplicationHistory(
  form: Ref<ApplicationForm>,
  implementation: Ref<Implementation>,
) {
  const recordMode = shallowRef<'immediate' | 'debounced'>('immediate')
  const immediateHistory = useRefHistory(form, { deep: true, capacity: 30 })
  const debouncedHistory = useDebouncedRefHistory(form, { deep: true, debounce: 600, capacity: 30 })
  const selectedVueHistory = computed(() => recordMode.value === 'debounced' ? debouncedHistory : immediateHistory)
  const history = computed(() => implementation.value === 'vueuse'
    ? selectedVueHistory.value.history.value.map((record) => record.snapshot as ApplicationForm)
    : [])
  const canUndo = computed(() => implementation.value === 'vueuse'
    ? selectedVueHistory.value.canUndo.value
    : false)
  const canRedo = computed(() => implementation.value === 'vueuse'
    ? selectedVueHistory.value.canRedo.value
    : false)

  function undo() {
    if (implementation.value !== 'vueuse') return
    const selected = selectedVueHistory.value
    commitPendingChanges()
    selected.undo()
  }

  function redo() {
    if (implementation.value !== 'vueuse') return
    const selected = selectedVueHistory.value
    commitPendingChanges()
    selected.redo()
  }

  function commitPendingChanges() {
    if (implementation.value !== 'vueuse') return
    const selected = selectedVueHistory.value
    const latestSnapshot = selected.history.value[0]?.snapshot
    if (JSON.stringify(latestSnapshot) !== JSON.stringify(form.value)) selected.commit()
  }

  function restore(snapshot: ApplicationForm) {
    if (implementation.value !== 'vueuse') return
    const selected = selectedVueHistory.value
    commitPendingChanges()
    const record = selected.history.value.find((item) => item.snapshot === snapshot)
    if (!record) return
    const undoCount = selected.history.value.indexOf(record)
    if (undoCount < 1) return
    for (let index = 0; index < undoCount; index += 1) selected.undo()
  }

  return { history, canUndo, canRedo, recordMode, undo, redo, restore, commitPendingChanges }
}
