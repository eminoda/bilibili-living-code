<script setup lang="ts">
import { motion } from 'motion-v'
import backgroundImage from '../assets/pokemon-field.jpg'

withDefaults(defineProps<{ blurred?: boolean }>(), {
  blurred: false,
})
</script>

<template>
  <motion.img
    class="scene-background"
    :src="backgroundImage"
    alt="宝可梦游戏中的森林道路"
    :initial="false"
    :animate="{ filter: blurred ? 'blur(7px)' : 'blur(2px)' }"
    :transition="{ duration: 0.55, ease: 'easeInOut' }"
  />
  <div class="scene-shade" />
</template>

<style lang="less" scoped>
.scene-background {
  position: absolute;
  z-index: -2;
  top: -28%;
  left: -2%;
  width: 104%;
  height: 150%;
  object-fit: fill;
}

.scene-shade {
  position: absolute;
  z-index: -1;
  inset: 0;
  background: rgb(3 18 9 / 10%);
}
</style>
