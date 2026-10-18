<script setup lang="ts">
import { nextTick, onBeforeUnmount, shallowRef, useId, useTemplateRef, watch } from 'vue'
import { AnimatePresence, motion } from 'motion-v'

const props = defineProps<{
  open: boolean
  memberName: string
  animated: boolean
}>()

const emit = defineEmits<{
  cancel: []
  confirm: []
  closed: []
}>()

const dialogId = useId()
const content = useTemplateRef<HTMLDivElement>('content')
const displayedName = shallowRef('')
const hiddenPanel = { opacity: 0, scale: 0.92, y: 16, rotateX: -50, rotateY: 12, filter: 'blur(4px)' }
const visiblePanel = { opacity: 1, scale: 1, y: 0, rotateX: 0, rotateY: 0, filter: 'blur(0px)' }
const exitingPanel = { opacity: 0, scale: 0.94, y: -8, rotateX: 28, rotateY: -10, filter: 'blur(4px)' }
let restoreBackground: (() => void) | undefined
let previousFocus: HTMLElement | null = null

function lockBackground() {
  if (restoreBackground) return
  previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
  const app = document.getElementById('app')
  const wasInert = app?.inert ?? false
  const body = document.body
  const overflow = body.style.overflow
  const paddingRight = body.style.paddingRight
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
  const currentPadding = Number.parseFloat(getComputedStyle(body).paddingRight) || 0

  body.style.overflow = 'hidden'
  if (scrollbarWidth > 0) body.style.paddingRight = `${currentPadding + scrollbarWidth}px`
  if (app) app.inert = true
  restoreBackground = () => {
    body.style.overflow = overflow
    body.style.paddingRight = paddingRight
    if (app) app.inert = wasInert
    if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
    previousFocus = null
    restoreBackground = undefined
  }
}

function finishClose() {
  restoreBackground?.()
  emit('closed')
}

function handleKeydown(event: KeyboardEvent) {
  if (!props.open) return
  if (event.key === 'Escape') {
    event.preventDefault()
    emit('cancel')
    return
  }
  if (event.key !== 'Tab') return
  const buttons = content.value?.querySelectorAll<HTMLButtonElement>('button')
  const first = buttons?.[0]
  const last = buttons?.[buttons.length - 1]
  if (!first || !last) return
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(() => props.open, async (open) => {
  if (!open) return
  displayedName.value = props.memberName
  if (!props.animated) return
  lockBackground()
  await nextTick()
  content.value?.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true })
}, { flush: 'post' })

onBeforeUnmount(() => restoreBackground?.())
</script>

<template>
  <el-dialog
    v-if="!animated"
    :model-value="open"
    title="确认删除"
    width="390px"
    :close-on-click-modal="false"
    @close="emit('cancel')"
    @closed="finishClose"
  >
    <p class="delete-confirm-description">
      确定要删除用户 <strong>{{ memberName }}</strong> 吗？
    </p>
    <template #footer>
      <el-button @click="emit('cancel')">取消</el-button>
      <el-button type="danger" @click="emit('confirm')">确认删除</el-button>
    </template>
  </el-dialog>

  <Teleport v-else to="body">
    <AnimatePresence @exit-complete="finishClose">
      <motion.div
        v-if="open"
        key="delete-confirm"
        class="delete-confirm-backdrop"
        :initial="animated ? { opacity: 0, backdropFilter: 'blur(0px)' } : false"
        :animate="{ opacity: 1, backdropFilter: animated ? 'blur(6px)' : 'blur(0px)' }"
        :exit="{ opacity: 0, backdropFilter: 'blur(0px)' }"
        :transition="{ duration: animated ? 0.28 : 0 }"
        @click.self="emit('cancel')"
        @keydown="handleKeydown"
      >
        <motion.section
          class="delete-confirm-panel"
          role="alertdialog"
          aria-modal="true"
          :aria-labelledby="`${dialogId}-title`"
          :aria-describedby="`${dialogId}-description`"
          :initial="animated ? hiddenPanel : false"
          :animate="visiblePanel"
          :exit="{ ...exitingPanel, transition: { duration: animated ? 0.26 : 0, ease: 'easeIn' } }"
          :transition="animated ? { type: 'spring', stiffness: 280, damping: 23, opacity: { duration: 0.18 }, filter: { duration: 0.2 } } : { duration: 0 }"
        >
          <div ref="content">
            <h2 :id="`${dialogId}-title`" class="delete-confirm-title">确认删除</h2>
            <p :id="`${dialogId}-description`" class="delete-confirm-description">
              确定要删除用户 <strong>{{ displayedName }}</strong> 吗？
            </p>
            <div class="delete-confirm-actions">
              <motion.button
                type="button"
                class="delete-confirm-button delete-confirm-button--cancel"
                :disabled="!open"
                :while-hover="animated ? { y: -1 } : undefined"
                :while-press="animated ? { scale: 0.96 } : undefined"
                @click="emit('cancel')"
              >取消</motion.button>
              <motion.button
                type="button"
                class="delete-confirm-button delete-confirm-button--danger"
                :disabled="!open"
                :while-hover="animated ? { y: -1 } : undefined"
                :while-press="animated ? { scale: 0.96 } : undefined"
                @click="emit('confirm')"
              >确认删除</motion.button>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </AnimatePresence>
  </Teleport>
</template>

<style scoped>
.delete-confirm-backdrop {
  position: fixed;
  z-index: 2200;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  overflow: hidden;
  perspective: 1000px;
  background: rgb(24 30 43 / 30%);
}
.delete-confirm-panel {
  width: min(100%, 390px);
  max-height: calc(100dvh - 48px);
  overflow-y: auto;
  box-sizing: border-box;
  padding: 24px;
  border: 1px solid rgb(255 255 255 / 75%);
  border-radius: 14px;
  background: #fff;
  color: #273244;
  box-shadow: 0 24px 80px rgb(18 25 42 / 22%);
  transform-origin: 50% 55%;
  backface-visibility: hidden;
  font-family: inherit;
}
.delete-confirm-title { margin: 0; font-size: 19px; font-weight: 650; line-height: 1.4; }
.delete-confirm-description { margin: 12px 0 24px; color: #7a8595; font-size: 14px; line-height: 1.75; overflow-wrap: anywhere; }
.delete-confirm-description strong { color: #354052; font-weight: 600; }
.delete-confirm-actions { display: flex; justify-content: flex-end; gap: 8px; }
.delete-confirm-button {
  height: 36px;
  padding: 0 14px;
  border: 0;
  border-radius: 7px;
  font: inherit;
  font-size: 13px;
  font-weight: 550;
  cursor: pointer;
}
.delete-confirm-button:focus-visible { outline: 2px solid #409eff; outline-offset: 3px; }
.delete-confirm-button--cancel { background: transparent; color: #6b7586; }
.delete-confirm-button--cancel:hover { background: #f1f3f7; }
.delete-confirm-button--danger { background: #e45555; color: #fff; }
.delete-confirm-button--danger:hover { background: #d44848; }
</style>
