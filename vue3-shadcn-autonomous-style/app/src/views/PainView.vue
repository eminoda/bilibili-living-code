<script setup lang="ts">
import { Button } from "ant-design-vue";
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-6 mx-auto max-w-xl text-center"
    data-testid="pain-stage"
  >
    <p class="text-2xl font-medium text-foreground">Ant Design 覆盖痛点</p>
    <div
      class="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4"
    >
      <Button type="primary" size="large" class="ant-btn ant-btn-primary">
        默认 Primary
      </Button>
      <Button
        type="primary"
        size="large"
        class="ant-btn ant-btn-primary pain-btn--green"
      >
        加 class：pain-btn--green
      </Button>
    </div>
  </div>
</template>

<style scoped>
/* 绿色档：:deep 穿透到 Ant 的 .ant-btn，背景与圆角均用 !important 与 token 争夺优先级 */
:deep(.pain-btn--green.ant-btn) {
  background-color: #22c55e !important;
  border-color: #16a34a !important;
  border-radius: 9999px !important;
}
</style>
