<script setup lang="ts">
import CodeBlock from '../CodeBlock.vue'

interface Props {
  id: string
  index: string
  title: string
  description: string
  cssCode: string
  motionCode: string
  cssLanguage?: 'css' | 'vue'
}

defineProps<Props>()
</script>

<template>
  <section :id="id" class="quick-section">
    <div class="section-heading">
      <span class="section-index">{{ index }}</span>
      <div>
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>
      </div>
      <a class="anchor-link" :href="`#${id}`" :aria-label="`链接到${title}`">#</a>
    </div>

    <div class="comparison-grid">
      <article class="comparison-card">
        <div class="card-heading"><span class="status-dot status-dot--css" />{{ cssLanguage === 'vue' ? 'Vue Transition + CSS' : 'CSS' }}</div>
        <div class="demo-stage"><slot name="css" /></div>
        <CodeBlock :code="cssCode" :language="cssLanguage ?? 'css'" :label="cssLanguage === 'vue' ? 'Vue Transition + CSS' : 'CSS'" />
      </article>

      <article class="comparison-card comparison-card--motion">
        <div class="card-heading"><span class="status-dot status-dot--motion" />Motion for Vue</div>
        <div class="demo-stage"><slot name="motion" /></div>
        <CodeBlock :code="motionCode" language="vue" label="Motion for Vue" />
      </article>
    </div>
    <p v-if="$slots.note" class="section-note"><slot name="note" /></p>
  </section>
</template>

<style scoped>
.quick-section { scroll-margin-top: 82px; margin-bottom: 72px; }
.section-heading { display: flex; align-items: start; gap: 14px; margin-bottom: 20px; }
.section-index { display: grid; width: 30px; height: 30px; flex: 0 0 auto; place-items: center; border: 1px solid #dbe1e9; border-radius: 8px; background: #fff; color: #6f7b8b; font: 10px 'DM Mono', monospace; }
.section-heading > div { flex: 1; }
.section-heading h2 { margin: 1px 0 6px; color: #1d2735; font-size: 23px; font-weight: 650; letter-spacing: -.035em; }
.section-heading p { max-width: 670px; margin: 0; color: #667386; font-size: 14px; line-height: 1.75; }
.anchor-link { color: #9aa4b2; font: 18px 'DM Mono', monospace; text-decoration: none; }
.anchor-link:hover { color: #5b50c4; }
.comparison-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.comparison-card { overflow: hidden; border: 1px solid #e1e6ed; border-radius: 11px; background: #fff; box-shadow: 0 5px 18px rgb(30 41 59 / 4%); }
.comparison-card--motion { border-color: #d8d2fa; }
.card-heading { display: flex; height: 45px; align-items: center; gap: 8px; padding: 0 15px; border-bottom: 1px solid #edf0f4; color: #3b4655; font-size: 12px; font-weight: 650; }
.status-dot { width: 7px; height: 7px; border-radius: 50%; }
.status-dot--css { background: #95a0af; }
.status-dot--motion { background: #6d5ce7; box-shadow: 0 0 0 3px #efedff; }
.demo-stage { display: grid; width: 600px; max-width: 100%; height: 600px; box-sizing: border-box; justify-self: center; place-items: center; padding: 20px; background: linear-gradient(180deg, #fff, #fbfcfe); }
:deep(.code-block) { font-size: 11px; }
.section-note { margin: 12px 0 0 44px; color: #69778a; font-size: 12px; line-height: 1.7; }
@media (max-width: 1530px) { .comparison-grid { grid-template-columns: 1fr; } }
@media (max-width: 760px) { .section-note { margin-left: 0; } }
</style>
