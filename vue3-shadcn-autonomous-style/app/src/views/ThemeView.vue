<script setup lang="ts">
import { useColorMode } from "@vueuse/core";
import Button from "@/components/ui/button/Button.vue";

const mode = useColorMode({
  selector: "html",
  attribute: "class",
  modes: {
    light: "",
    dark: "dark",
  },
});

function toggleTheme() {
  mode.value = mode.value === "dark" ? "light" : "dark";
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-6 mx-auto max-w-lg text-center"
    data-testid="theme-stage"
  >
    <p class="text-2xl font-medium">语义色 + .dark 一键切换</p>
    <Button type="button" size="lg" @click="toggleTheme">切换明暗</Button>
    <p class="text-lg opacity-80">当前：{{ mode }}</p>
  </div>
</template>
