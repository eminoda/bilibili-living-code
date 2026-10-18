<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import Card from "@/components/ui/card/Card.vue";
</script>

<template>
  <div
    class="flex flex-col items-center gap-10 w-full max-w-3xl mx-auto"
    data-testid="ownership-stage"
  >
    <div class="text-center space-y-3 w-full">
      <p class="text-2xl font-semibold tracking-tight">组件在仓库里（示意目录）</p>
      <pre
        class="text-left text-base bg-card border border-border rounded-lg p-4 overflow-x-auto shadow-sm"
      ><code>src/components/ui/
├── button/
│   ├── Button.vue
│   └── button-variants.ts
└── card/
    └── Card.vue</code></pre>
    </div>

    <!-- 录屏：与上方「纯文本树」区隔，按钮/卡片对比更强 -->
    <div
      class="w-full rounded-2xl border-2 border-dashed border-primary/35 bg-gradient-to-br from-muted/50 via-card to-muted/40 p-8 md:p-10 shadow-inner"
      data-testid="ownership-preview"
    >
      <p
        class="text-center text-lg font-medium text-muted-foreground mb-8 tracking-wide"
      >
        本地组件预览 — 改的是下面两个文件，不是 node_modules
      </p>
      <div
        class="flex flex-col md:flex-row flex-wrap gap-10 justify-center items-center md:items-stretch"
      >
        <Button
          size="lg"
          data-testid="ownership-demo-button"
          class="min-w-[200px] text-xl font-semibold shadow-lg shadow-primary/30 ring-2 ring-primary/25 transition-all hover:shadow-xl hover:shadow-primary/35 hover:ring-primary/45 hover:scale-[1.02] active:scale-[0.98]"
        >
          主按钮 · Button.vue
        </Button>
        <Card
          data-testid="ownership-demo-card"
          class="min-w-[280px] max-w-md border-2 border-primary/25 bg-card/95 backdrop-blur-sm shadow-2xl shadow-primary/15 ring-4 ring-primary/10 transition-transform hover:-translate-y-0.5 hover:shadow-primary/25"
        >
          <div class="space-y-3">
            <p class="text-xl font-bold text-primary tracking-tight">
              Card.vue · 你的容器
            </p>
            <p class="text-lg leading-relaxed text-muted-foreground">
              加粗边框 + 大投影 + 外环，录屏里和「目录树」一眼分层；文案、圆角、阴影都在你仓库里改。
            </p>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>
