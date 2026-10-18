<script setup lang="ts">
import { reactive, shallowRef } from 'vue'
import { motion, useReducedMotion } from 'motion-v'
import BilibiliActionIcon from './BilibiliActionIcon.vue'
import BilibiliPinkBurst from './BilibiliPinkBurst.vue'

defineProps<{ disabled: boolean }>()
const selected = reactive({ like: false, coin: false, favorite: false })
const following = shallowRef(false)
const celebration = shallowRef(0)
const reducedMotion = useReducedMotion()
const actions = [
  { name: 'like', label: '点赞' },
  { name: 'coin', label: '投币' },
  { name: 'favorite', label: '收藏' },
] as const

function toggleFollow() {
  following.value = !following.value
  if (!following.value) return
  for (const action of actions) selected[action.name] = true
  celebration.value += 1
}
</script>

<template>
  <div class="support-actions" role="group" aria-label="点赞、投币、收藏与关注">
    <div class="support-icons">
      <div
        v-for="(action, index) in actions"
        :key="action.name"
        class="support-icon-slot"
      >
      <motion.button
        class="support-icon"
        :class="{ 'support-icon--selected': selected[action.name] }"
        type="button"
        :aria-label="action.label"
        :aria-pressed="selected[action.name]"
        :disabled="disabled"
        :whileHover="{ scale: 1.12, y: -3 }"
        :whilePress="{ scale: .9 }"
        :transition="{ type: 'spring', stiffness: 380, damping: 22 }"
        @click="selected[action.name] = !selected[action.name]"
      >
        <motion.span
          :key="celebration"
          class="icon-artwork"
          :initial="{ scale: 1 }"
          :animate="celebration > 0 && !reducedMotion ? { scale: [1, 1.28, .94, 1] } : { scale: 1 }"
          :transition="{ duration: .5, delay: index * .06, times: [0, .3, .65, 1], ease: 'easeOut' }"
        >
          <BilibiliActionIcon :name="action.name" />
        </motion.span>
      </motion.button>
      <BilibiliPinkBurst v-if="celebration > 0 && !reducedMotion" :key="celebration" :delay="index * .06" />
      </div>
    </div>
    <motion.button
      class="follow-button"
      :class="{ 'follow-button--selected': following }"
      type="button"
      :aria-pressed="following"
      :disabled="disabled"
      :whileHover="{ scale: 1.04 }"
      :whilePress="{ scale: .95 }"
      :transition="{ type: 'spring', stiffness: 380, damping: 24 }"
      @click="toggleFollow"
    >
      <BilibiliActionIcon v-if="!following" class="follow-plus" name="follow" />
      <span>{{ following ? '已关注' : '关注' }}</span>
    </motion.button>
  </div>
</template>

<style scoped>
.support-actions { display: flex; flex-direction: column; align-items: center; gap: clamp(12px, 3vw, 28px); }
.support-icons { display: flex; align-items: center; gap: clamp(12px, 3.4vw, 38px); }
.support-icon-slot { position: relative; }
.icon-artwork { display: block; width: 100%; height: 100%; }
.support-icon { display: grid; width: clamp(44px, 8vw, 76px); height: clamp(44px, 8vw, 76px); place-items: center; padding: 8px; border: 0; border-radius: 12px; background: transparent; color: #9499a0; cursor: pointer; transition: color 160ms ease, background 160ms ease; }
.support-icon:hover,.support-icon--selected { color: #fb7299; }
.support-icon--selected { background: #fff0f5; }
.follow-button { display: inline-flex; min-width: clamp(104px, 18vw, 160px); min-height: clamp(30px, 4.7vw, 42px); align-items: center; justify-content: center; gap: 8px; padding: 0 18px; border: 1px solid #00aeec; border-radius: 6px; background: #00aeec; color: #fff; font-size: clamp(12px, 2vw, 15px); font-weight: 500; cursor: pointer; }
.follow-button:hover { border-color: #00b9fa; background: #00b9fa; }
.follow-button--selected,.follow-button--selected:hover { border-color: #e3e5e7; background: #f1f2f3; color: #9499a0; }
.follow-plus { width: 16px; height: 16px; }
.support-icon:focus-visible,.follow-button:focus-visible { outline: 2px solid #00aeec; outline-offset: 4px; }
.support-icon:disabled,.follow-button:disabled { cursor: default; }
</style>
