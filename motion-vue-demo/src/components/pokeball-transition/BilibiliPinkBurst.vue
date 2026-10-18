<script setup lang="ts">
import { shallowRef } from 'vue'
import { motion } from 'motion-v'

withDefaults(defineProps<{ delay?: number }>(), { delay: 0 })
const finished = shallowRef(false)
const particles = Array.from({ length: 16 }, (_, index) => {
  const angle = (index / 16) * Math.PI * 2 - Math.PI / 2
  const distance = 49 + (index % 4) * 9
  return {
    id: index,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    rotate: index * 37,
    duration: .7 + (index % 4) * .055,
    color: ['#fb7299', '#ff9fbb', '#f94883', '#ffc4d6'][index % 4],
    shape: index % 4 === 0 ? 'spark' : index % 2 === 0 ? 'dash' : 'dot',
  }
})
</script>

<template>
  <span v-if="!finished" class="burst-origin" aria-hidden="true">
    <motion.span
      class="burst-layer"
      :initial="{ opacity: 1 }"
      :animate="{ opacity: [1, 1, 0] }"
      :transition="{ duration: .95, delay, times: [0, .9, 1] }"
      @animation-complete="finished = true"
    >
      <motion.span class="burst-ring" :initial="{ scale: .35, opacity: .65 }" :animate="{ scale: 1.9, opacity: 0 }" :transition="{ duration: .65, delay, ease: 'easeOut' }" />
      <motion.span
        v-for="particle in particles"
        :key="particle.id"
        class="burst-particle"
        :class="`burst-particle--${particle.shape}`"
        :style="{ backgroundColor: particle.color }"
        :initial="{ x: 0, y: 0, scale: .2, opacity: 0, rotate: particle.rotate }"
        :animate="{
          x: [0, particle.x * .72, particle.x],
          y: [0, particle.y * .72, particle.y + 12],
          scale: [.2, 1, .6],
          opacity: [0, 1, 0],
          rotate: [particle.rotate, particle.rotate + 90, particle.rotate + 150],
        }"
        :transition="{ duration: particle.duration, delay, times: [0, .35, 1], ease: 'easeOut' }"
      />
    </motion.span>
  </span>
</template>

<style scoped>
.burst-origin { position: absolute; z-index: 2; top: 50%; left: 50%; width: 0; height: 0; pointer-events: none; }
.burst-layer { position: absolute; inset: 0; }
.burst-ring { position: absolute; top: -29px; left: -29px; width: 58px; height: 58px; border: 2px solid #fb7299; border-radius: 50%; }
.burst-particle { position: absolute; top: -3px; left: -3px; width: 6px; height: 6px; border-radius: 50%; }
.burst-particle--dash { top: -6px; width: 4px; height: 12px; border-radius: 3px; }
.burst-particle--spark { top: -6px; left: -6px; width: 12px; height: 12px; border-radius: 0; clip-path: polygon(50% 0, 64% 36%, 100% 50%, 64% 64%, 50% 100%, 36% 64%, 0 50%, 36% 36%); }
@media (max-width: 480px) { .burst-origin { transform: scale(.65); } }
</style>
