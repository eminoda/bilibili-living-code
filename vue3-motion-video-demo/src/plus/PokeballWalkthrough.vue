<script setup lang="ts">
import PokeballFinale from './PokeballFinale.vue'
import PokeballStepA from './PokeballStepA.vue'
import PokeballStepB from './PokeballStepB.vue'
import PokeballStepC from './PokeballStepC.vue'
import PokeballStepD from './PokeballStepD.vue'
import PokeballStepE from './PokeballStepE.vue'
</script>

<template>
  <section class="pokeball-walkthrough">
    <header class="walkthrough-heading">
      <p class="eyebrow">PLUS · 分步拆解</p>
      <h1>精灵球转场</h1>
      <p>从背景和球体开始，逐层完成球壳、白板、三连，再组合成完整转场。</p>
    </header>

    <div class="lesson-grid">
      <article class="lesson-card">
        <div class="lesson-copy">
          <span class="lesson-index">A</span>
          <div>
            <h2>搭建背景</h2>
            <p>切换背景虚化，演示转场时的景深变化。</p>
          </div>
        </div>
        <PokeballStepA />
      </article>

      <article class="lesson-card">
        <div class="lesson-copy">
          <span class="lesson-index">B</span>
          <div>
            <h2>放入精灵球</h2>
            <p>点击精灵球播放旋转，悬停和按压也有反馈。</p>
          </div>
        </div>
        <PokeballStepB />
      </article>

      <article class="lesson-card">
        <div class="lesson-copy">
          <span class="lesson-index">C</span>
          <div>
            <h2>球壳变形</h2>
            <p>只演示球体外壳旋转并拉伸为圆角框。</p>
          </div>
        </div>
        <PokeballStepC />
      </article>

      <article class="lesson-card">
        <div class="lesson-copy">
          <span class="lesson-index">D</span>
          <div>
            <h2>白板展开</h2>
            <p>在外框内单独展开白色内容区域，并淡出球体。</p>
          </div>
        </div>
        <PokeballStepD />
      </article>

      <article class="lesson-card">
        <div class="lesson-copy">
          <span class="lesson-index">E</span>
          <div>
            <h2>加入 B 站三连</h2>
            <p>复用白板组件，加入点赞、投币、收藏和关注操作。</p>
          </div>
        </div>
        <PokeballStepE />
      </article>
    </div>

    <section class="final-demo">
      <PokeballFinale />
    </section>
  </section>
</template>

<style lang="less" scoped>
.pokeball-walkthrough {
  width: min(920px, calc(100vw - 32px));
  padding: 36px 0 52px;
  color: #f2f2f4;
}

.walkthrough-heading {
  margin-bottom: 24px;

  h1 {
    margin: 8px 0;
    font-size: clamp(24px, 4vw, 32px);
    font-weight: 650;
    letter-spacing: -0.04em;
  }

  > p:last-child {
    margin: 0;
    color: #85858e;
    font-size: 13px;
    line-height: 1.7;
  }
}

.eyebrow {
  margin: 0;
  color: #f47290;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.lesson-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.lesson-card {
  min-width: 0;
  padding: 12px;
  border: 1px solid rgb(255 255 255 / 9%);
  border-radius: 12px;
  background: rgb(255 255 255 / 3%);
}

.lesson-copy {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;

  h2 {
    margin: 0;
    color: #e7e7eb;
    font-size: 13px;
    font-weight: 600;
  }

  p {
    margin: 5px 0 0;
    color: #85858e;
    font-size: 11px;
    line-height: 1.6;
  }
}

.lesson-index {
  display: grid;
  width: 24px;
  height: 24px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 7px;
  background: rgb(244 114 144 / 13%);
  color: #f68aa2;
  font-size: 11px;
  font-weight: 700;
}

.final-demo {
  width: min(480px, 100%);
  box-sizing: border-box;
  margin: 200px auto;
  padding: 18px;
  border: 1px solid rgb(255 255 255 / 9%);
  border-radius: 14px;
  background: rgb(255 255 255 / 3%);
}

@media (max-width: 720px) {
  .lesson-card {
    padding: 14px;
  }

  .final-demo {
    padding: 14px;
  }
}
</style>
