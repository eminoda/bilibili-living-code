<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { motion } from 'motion-v'
import backgroundImage from '../assets/pokemon-field.jpg'
import PokeballSymbol from './PokeballSymbol.vue'
import BilibiliSupportActions from './BilibiliSupportActions.vue'
import { usePokeballMorph } from './usePokeballMorph'

const stage = useTemplateRef<HTMLElement>('stage')
const {
  expanded,
  animating,
  diameter,
  duration,
  shellTarget,
  shellTransition,
  surfaceTarget,
  symbolTarget,
  toggle,
  complete,
} = usePokeballMorph(stage)
</script>

<template>
  <section class="transition-case">
    <div
      ref="stage"
      class="transition-stage"
    >
      <motion.img
        class="scene-background"
        :src="backgroundImage"
        alt="宝可梦游戏中的森林道路"
        :initial="false"
        :animate="{ filter: expanded ? 'blur(7px)' : 'blur(2px)' }"
        :transition="{ duration: duration * 0.65 }"
      />
      <div class="scene-shade" />
      <div class="morph-anchor">
        <motion.div
          class="morph-shell"
          :initial="false"
          :animate="shellTarget"
          :transition="shellTransition"
          @animation-complete="complete"
        >
          <motion.div
            class="panel-surface"
            :initial="false"
            :animate="surfaceTarget"
            :transition="{ duration, times: [0, 0.3, 0.45, 1], ease: 'easeInOut' }"
          >
            <motion.div
              class="panel-actions"
              :initial="false"
              :animate="{ opacity: expanded ? 1 : 0, y: expanded ? 0 : 10 }"
              :transition="{ duration: Math.min(0.24, duration), delay: expanded ? duration : 0 }"
            >
              <BilibiliSupportActions :disabled="!expanded || animating" />
            </motion.div>
          </motion.div>
          <div class="symbol-anchor">
            <motion.div
              class="symbol-motion"
              :style="{ width: `${diameter * 0.53}px`, height: `${diameter * 0.53}px` }"
              :initial="false"
              :animate="symbolTarget"
              :transition="{
                duration: duration * 0.9,
                times: [0, 0.3, 0.62, 1],
                ease: 'easeInOut',
              }"
            >
              <PokeballSymbol :expanded="expanded" />
            </motion.div>
          </div>
          <button
            v-if="!expanded"
            class="ball-trigger"
            type="button"
            :disabled="animating"
            @click="toggle"
          />
        </motion.div>
      </div>
    </div>

    <div class="demo-controls">
      <p>
        {{ animating ? '转场播放中…' : expanded ? '展开完成' : '点击中央的精灵球' }}
      </p>
      <button
        class="replay-button"
        type="button"
        :disabled="animating"
        @click="toggle"
      >
        <span>{{ expanded ? '↶' : '▷' }}</span>
        {{ expanded ? '收起面板' : '播放动画' }}
      </button>
    </div>
  </section>
</template>

<style lang="less" scoped>
.transition-case {
  width: min(760px, 100%);
}

.transition-stage {
  position: relative;
  isolation: isolate;
  width: 100%;
  aspect-ratio: 8 / 5;
  overflow: hidden;
  background: #3f8957;
}

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

.morph-anchor {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.morph-shell {
  position: relative;
  display: flex;
  width: 124px;
  height: 124px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 3px solid #fff;
  border-radius: 62px;
  background: #f31e4b;
  box-shadow: 0 5px 14px rgb(26 9 17 / 18%);
}

.panel-surface {
  position: relative;
  width: 0;
  height: 0;
  flex: 0 0 auto;
  overflow: hidden;
  border-radius: 9px;
  background: #fff;
  opacity: 0;
}

.panel-actions {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 12px;
  opacity: 0;
}

.symbol-anchor {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
}

.symbol-motion {
  flex: 0 0 auto;
}

.ball-trigger {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  border-radius: inherit;
  background: transparent;
  cursor: pointer;

  &:focus-visible {
    outline: 3px solid #ffdb73;
    outline-offset: -7px;
  }

  &:disabled {
    cursor: wait;
  }
}

.demo-controls {
  display: flex;
  min-height: 54px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  p {
    margin: 0;
    color: #85858e;
    font-size: 11px;
  }
}

.replay-button {
  display: inline-flex;
  min-height: 30px;
  align-items: center;
  gap: 7px;
  padding: 0 11px;
  border: 1px solid #303039;
  border-radius: 6px;
  background: #141417;
  color: #c8c8cf;
  font-size: 11px;
  cursor: pointer;

  span {
    font-size: 15px;
  }

  &:hover {
    border-color: #5b4650;
    background: #20171c;
  }

  &:disabled {
    opacity: 0.45;
    cursor: wait;
  }

  &:focus-visible {
    outline: 2px solid #f36e90;
    outline-offset: 3px;
  }
}

@media (max-width: 480px) {
  .morph-shell {
    border-width: 2px;
  }

  .panel-surface {
    border-radius: 6px;
  }

  .demo-controls p,
  .replay-button {
    font-size: 10px;
  }
}
</style>
