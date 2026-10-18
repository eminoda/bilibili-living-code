<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { Primitive } from 'reka-ui'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiBadge' })

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      tone?: 'neutral' | 'success' | 'warning'
      class?: HTMLAttributes['class']
    }
  >(),
  { tone: 'neutral' },
)

const delegatedProps = reactiveOmit(props, 'class', 'tone')
</script>

<template>
  <Primitive
    data-slot="badge"
    :class="
      cn(
        'inline-flex w-fit shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-transparent px-2.5 py-1 text-xs font-semibold',
        {
          'bg-secondary text-secondary-foreground': props.tone === 'neutral',
          'bg-emerald-50 text-emerald-700': props.tone === 'success',
          'bg-amber-50 text-amber-700': props.tone === 'warning',
        },
        props.class,
      )
    "
    v-bind="delegatedProps"
  >
    <slot />
  </Primitive>
</template>
