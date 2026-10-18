<script setup>
import { motion } from 'motion-v'
</script>

<template>
  <motion.div
    class="box"
    :animate="{ rotate: 360 }"
    :transition="{ duration: 3 }"
  />
</template>

<style>
.box {
  width: 100px;
  height: 100px;
  background-color: #0cdcf7;
  border-radius: 5px;
}
</style>
