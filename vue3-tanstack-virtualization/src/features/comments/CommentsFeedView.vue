<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { Badge } from '@/components/ui/badge'

interface CommentRow {
  id: string
  author: string
  time: string
  content: string
}

const batchSize = 20
const rowHeight = 88
const names = [
  '林同学',
  '阿杰',
  '小周',
  'Mia',
  '前端小白',
  'Kevin',
  '橙子',
  '陈同学',
  'Momo',
  'Jack',
  '一颗栗子',
  'Leo',
  '小雨',
  'May',
  '海盐',
  'Seven',
  '小鱼',
  'Andy',
  '南风',
  'Nina',
]
const commentTexts = [
  '这个例子很直观，数据还在，但页面不用一次创建所有行。',
  '如果每条内容高度不同，估算行高后还能保持滚动位置吗？',
  '原来 Infinite Scroll 和虚拟列表解决的是两个不同的问题。',
  '已经加载到客户端的内容，滚远之后对应的 DOM 也会卸载吗？',
  '项目里的评论列表正好遇到这个问题，准备试一下。',
  '滚动到中间位置时，怎么跳回某一条指定评论？',
  'overscan 设置得太大，会不会又让 DOM 数量增加很多？',
  '只用分页的话，当前页面里的记录还是会同时渲染出来。',
  '这套方式是不是也能用在消息记录和通知列表？',
  '想看一下加载更多和虚拟渲染同时工作的效果。',
  '滚动条还能表示完整列表的长度，这点挺巧妙。',
  '如果列表还有筛选条件，筛选以后要重新计算虚拟行吗？',
  '以前以为无限滚动就能解决长列表的性能问题。',
  '渲染行数稳定下来以后，滚动时的卡顿确实少很多。',
  '希望补一个动态高度列表的例子。',
  '列表虚拟化不会减少已经下载到浏览器的数据量，这个边界很重要。',
  '同一份数据比较普通列表和 Virtual，差别一下就看到了。',
  '加载下一批的时候，最好也能看到明确的 loading 状态。',
  '评论区这种场景比用户列表全量加载更符合实际。',
  '讲清楚“什么时候加载”和“同时渲染多少”就容易理解了。',
]
const times = ['刚刚', '2 分钟前', '5 分钟前', '今天 10:24', '昨天']
const colors = [
  'bg-sky-100 text-sky-700',
  'bg-violet-100 text-violet-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
]

function makeComments(start: number, count: number): CommentRow[] {
  return Array.from({ length: count }, (_, offset) => {
    const index = start + offset
    return {
      id: String(index + 1).padStart(6, '0'),
      author: names[index % names.length]!,
      time: times[index % times.length]!,
      content: commentTexts[index % commentTexts.length]!,
    }
  })
}

const comments = shallowRef(makeComments(0, batchSize))
const scrollElement = ref<HTMLElement | null>(null)
const loading = ref(false)
const virtualizer = useVirtualizer(
  computed(() => ({
    count: comments.value.length,
    getScrollElement: () => scrollElement.value,
    estimateSize: () => rowHeight,
    overscan: 5,
    getItemKey: (index: number) => comments.value[index]?.id ?? index,
  })),
)
const virtualRows = computed(() => virtualizer.value.getVirtualItems())
const totalSize = computed(() => virtualizer.value.getTotalSize())

async function loadMore() {
  if (loading.value) return
  loading.value = true
  await new Promise((resolve) => window.setTimeout(resolve, 400))
  comments.value = [...comments.value, ...makeComments(comments.value.length, batchSize)]
  loading.value = false
}

watch(virtualRows, (items) => {
  const lastIndex = items.at(-1)?.index
  if (lastIndex !== undefined && lastIndex >= comments.value.length - 3) {
    void loadMore()
  }
})
</script>

<template>
  <div>
    <p class="mb-6 text-sm text-muted-foreground">
      向下滚动加载更多评论，观察已加载数据和当前渲染行数。
    </p>

    <section class="mb-5 grid gap-3 sm:grid-cols-2" aria-label="评论列表状态">
      <div class="rounded-lg border border-border bg-white px-4 py-3">
        <p class="text-xs text-muted-foreground">已加载评论</p>
        <p class="mt-1 text-lg font-semibold tabular-nums">
          {{ comments.length.toLocaleString() }} 条
        </p>
      </div>
      <div class="rounded-lg border border-border bg-white px-4 py-3">
        <p class="text-xs text-muted-foreground">当前渲染行数</p>
        <p class="mt-1 text-lg font-semibold tabular-nums">{{ virtualRows.length }} 行</p>
      </div>
    </section>

    <section
      class="overflow-hidden rounded-xl border border-border bg-white shadow-sm"
      aria-label="评论列表演示"
    >
      <div class="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 class="font-semibold">最新评论</h2>
        <Badge tone="neutral">滚动加载 · Virtual</Badge>
      </div>

      <div ref="scrollElement" class="max-h-[560px] min-h-[400px] overflow-auto overscroll-contain">
        <div class="relative" :style="{ height: `${totalSize}px` }" role="list" aria-label="评论">
          <article
            v-for="virtualRow in virtualRows"
            :key="String(virtualRow.key)"
            role="listitem"
            :aria-posinset="virtualRow.index + 1"
            :aria-setsize="comments.length"
            class="absolute inset-x-0 flex h-[88px] items-start gap-3 border-b border-border/80 px-5 py-4 last:border-0"
            :style="{ transform: `translateY(${virtualRow.start}px)` }"
          >
            <div
              class="grid size-9 shrink-0 place-items-center rounded-full text-xs font-semibold"
              :class="colors[virtualRow.index % colors.length]"
            >
              {{ comments[virtualRow.index]?.author.slice(0, 1) }}
            </div>
            <div class="min-w-0 flex-1">
              <div class="mb-1 flex items-center gap-2 text-xs">
                <span class="font-semibold text-foreground">{{
                  comments[virtualRow.index]?.author
                }}</span>
                <span class="text-muted-foreground">{{ comments[virtualRow.index]?.time }}</span>
              </div>
              <p class="truncate text-sm leading-5 text-muted-foreground">
                {{ comments[virtualRow.index]?.content }}
              </p>
            </div>
          </article>
        </div>
        <div
          class="flex h-12 items-center justify-center border-t border-border text-xs text-muted-foreground"
        >
          {{ loading ? '正在加载更多评论…' : '继续向下滚动加载' }}
        </div>
      </div>
    </section>
  </div>
</template>
