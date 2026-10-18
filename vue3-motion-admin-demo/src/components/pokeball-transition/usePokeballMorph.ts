import { computed, onBeforeUnmount, onMounted, shallowRef, type Ref } from 'vue'
import { useReducedMotion, type MotionProps } from 'motion-v'

export function usePokeballMorph(stage: Ref<HTMLElement | null>) {
  const expanded = shallowRef(false)
  const animating = shallowRef(false)
  const reducedMotion = useReducedMotion()
  const bounds = shallowRef({ width: 760, height: 475 })
  let observer: ResizeObserver | undefined

  onMounted(() => {
    const element = stage.value
    if (!element) return
    const measure = () => {
      bounds.value = { width: element.clientWidth, height: element.clientHeight }
    }
    measure()
    observer = new ResizeObserver(measure)
    observer.observe(element)
  })
  onBeforeUnmount(() => observer?.disconnect())

  const diameter = computed(() => Math.min(124, Math.max(68, bounds.value.width * .18)))
  const panelWidth = computed(() => bounds.value.width * .9)
  const panelHeight = computed(() => bounds.value.height * .85)
  const frameWidth = computed(() => Math.min(22, bounds.value.width * .03))
  const duration = computed(() => reducedMotion.value ? .01 : expanded.value ? .95 : .5)

  const shellTarget = computed<MotionProps['animate']>(() => {
    const ball = diameter.value
    if (!expanded.value) return { width: ball, height: ball, borderRadius: ball / 2, rotate: 0 }
    if (reducedMotion.value) return { width: panelWidth.value, height: panelHeight.value, borderRadius: 22, rotate: -360 }
    return {
      width: [ball, ball * 1.13, panelWidth.value],
      height: [ball, ball * 1.13, panelHeight.value],
      borderRadius: [ball / 2, ball / 2, 22],
      rotate: [0, -360, -360],
    }
  })
  const shellTransition = computed<MotionProps['transition']>(() => ({
    duration: duration.value, ease: 'easeInOut', times: [0, .4, 1],
    rotate: { duration: duration.value, times: [0, .45, 1], ease: 'easeInOut' },
  }))
  const surfaceTarget = computed<MotionProps['animate']>(() => {
    if (!expanded.value) return { width: 0, height: 0, opacity: 0 }
    const width = panelWidth.value - frameWidth.value * 2
    const height = panelHeight.value - frameWidth.value * 2
    if (reducedMotion.value) return { width, height, opacity: 1 }
    return {
      width: [0, 0, diameter.value * .3, width],
      height: [0, 0, diameter.value * .22, height],
      opacity: [0, 0, 1, 1],
    }
  })
  const symbolTarget = computed<MotionProps['animate']>(() => {
    if (!expanded.value) return { scale: 1, opacity: 1 }
    if (reducedMotion.value) return { scale: 1, opacity: 0 }
    return { scale: [1, .36, .48, 1.05], opacity: [1, 1, 1, 0] }
  })
  function toggle() {
    if (animating.value) return
    animating.value = true
    expanded.value = !expanded.value
  }
  function complete() { animating.value = false }

  return { expanded, animating, diameter, duration, shellTarget, shellTransition, surfaceTarget, symbolTarget, toggle, complete }
}
