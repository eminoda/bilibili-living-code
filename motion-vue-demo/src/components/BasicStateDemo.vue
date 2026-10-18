<script setup lang="ts">
import { ref } from 'vue'
import { motion } from 'motion-v'

const isOn = ref(false)
</script>

<template>
  <section class="lesson" aria-labelledby="basic-title">
    <div class="lesson-heading">
      <span class="lesson-number">01</span>
      <div>
        <span class="eyebrow">START HERE · STATE</span>
        <h2 id="basic-title">状态变了，动画就跟着变</h2>
        <p>点一下开关。先看最简单的 `:animate`：把 Vue 状态变成动画目标。</p>
      </div>
    </div>

    <div class="comparison-grid">
      <article class="example-panel">
        <div class="panel-label"><span class="method-dot method-dot--css" />CSS</div>
        <div class="switch-stage">
          <div class="switch-track" :class="{ 'switch-track--on': isOn }">
            <div class="switch-knob switch-knob--css" :class="{ 'switch-knob--on': isOn }" />
            <span>{{ isOn ? '开' : '关' }}</span>
          </div>
          <button class="lesson-button" type="button" :aria-pressed="isOn" @click="isOn = !isOn">
            {{ isOn ? '关掉开关' : '打开开关' }}
          </button>
        </div>
        <pre><code>.switch-knob { transition: transform .5s ease; }
.switch-knob--on { transform: translateX(204px); }</code></pre>
      </article>

      <article class="example-panel example-panel--motion">
        <div class="panel-label"><span class="method-dot method-dot--motion" />Motion for Vue</div>
        <div class="switch-stage">
          <div class="switch-track" :class="{ 'switch-track--on': isOn }">
            <motion.div
              class="switch-knob switch-knob--motion"
              :animate="{ x: isOn ? 204 : 0, scale: isOn ? 1.08 : 1 }"
              :transition="{ type: 'spring', stiffness: 420, damping: 19 }"
            />
            <span>{{ isOn ? '开' : '关' }}</span>
          </div>
          <button class="lesson-button" type="button" :aria-pressed="isOn" @click="isOn = !isOn">
            {{ isOn ? '关掉开关' : '打开开关' }}
          </button>
        </div>
        <pre><code>&lt;motion.div
  :animate="{ x: isOn ? 204 : 0 }"
  :transition="{ type: 'spring' }"
/&gt;</code></pre>
      </article>
    </div>
    <p class="lesson-note"><strong>感受：</strong>CSS 用 transition 把两个 class 状态连起来；Motion 直接接收 `isOn` 算出的目标，并用弹簧到达它。</p>
  </section>
</template>

<style scoped>
.lesson { margin: 22px 0 46px; }
.lesson-heading { display: flex; align-items: start; gap: 14px; margin-bottom: 16px; }
.lesson-number { display: grid; width: 32px; height: 32px; flex: 0 0 auto; place-items: center; border: 1px solid #dbe3d4; border-radius: 10px; color: #688660; font-size: 11px; font-weight: 740; }
.eyebrow { color: #858b82; font-size: 9px; font-weight: 760; letter-spacing: 0.13em; }
.lesson-heading h2 { margin: 6px 0 4px; color: #202722; font-size: clamp(19px, 2.5vw, 25px); letter-spacing: -0.045em; }
.lesson-heading p { margin: 0; color: #747b72; font-size: 12px; }
.comparison-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.example-panel { overflow: hidden; border: 1px solid #e7e5dc; border-radius: 16px; background: #fffefa; }
.example-panel--motion { border-color: #cfded0; box-shadow: 0 8px 24px rgb(71 111 76 / 6%); }
.panel-label { display: flex; align-items: center; gap: 8px; padding: 13px 16px; border-bottom: 1px solid #f0eee7; color: #343b35; font-size: 11px; font-weight: 680; }
.method-dot { width: 8px; height: 8px; border-radius: 50%; }
.method-dot--css { background: #bc9a71; }
.method-dot--motion { background: #5c9e67; }
.switch-stage { display: grid; justify-items: center; gap: 14px; padding: 20px; }
.switch-track { position: relative; display: flex; width: min(100%, 260px); height: 52px; align-items: center; justify-content: center; overflow: hidden; border: 1px solid #e5e5dc; border-radius: 999px; background: #f2f1eb; transition: background 220ms ease; }
.switch-track--on { background: #e6f1e0; }
.switch-track > span { color: #92998e; font-size: 9px; font-weight: 800; letter-spacing: 0.2em; }
.switch-knob { position: absolute; top: 6px; left: 6px; width: 38px; height: 38px; border: 1px solid #e5e4dc; border-radius: 50%; background: #fffefa; box-shadow: 0 3px 8px rgb(39 47 37 / 10%); }
.switch-knob--css { transition: transform 520ms cubic-bezier(0.2, 0.8, 0.2, 1); }
.switch-knob--css.switch-knob--on { transform: translateX(204px); }
.switch-knob--motion { border-color: #b9d2b4; background: #fafff6; }
.lesson-button { padding: 7px 11px; border: 1px solid #e4e3dc; border-radius: 8px; background: #fffefa; color: #586257; cursor: pointer; font: inherit; font-size: 10px; }
.example-panel pre { overflow-x: auto; margin: 0; padding: 12px 16px 14px; border-top: 1px solid #f0eee7; background: #faf9f5; color: #485048; font-family: 'DM Mono', Consolas, monospace; font-size: 9px; line-height: 1.7; }
.lesson-note { display: flex; gap: 5px; margin: 11px 0 0 46px; color: #687164; font-size: 10px; line-height: 1.6; }
.lesson-note strong { color: #456a48; white-space: nowrap; }

@media (max-width: 650px) {
  .comparison-grid { grid-template-columns: 1fr; }
  .lesson-note { margin-left: 0; }
}
</style>
