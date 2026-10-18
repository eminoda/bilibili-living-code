<script setup lang="ts">
import { computed } from "vue";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button-variants";

const props = withDefaults(
  defineProps<{
    variant?: "default" | "destructive";
    size?: "default" | "lg";
    class?: string;
    type?: "button" | "submit" | "reset";
  }>(),
  { variant: "default", size: "default", type: "button" },
);

const cls = computed(() =>
  cn(buttonVariants({ variant: props.variant, size: props.size }), props.class),
);
</script>

<template>
  <button :type="type" :class="cls">
    <slot />
  </button>
</template>
