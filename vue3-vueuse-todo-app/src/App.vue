<template>
  <div class="max-w-xl mx-auto p-6 mt-10 bg-white dark:bg-gray-800">
    <h1 class="text-3xl font-bold text-green-500 mb-6 text-center">Todo List</h1>
    <div class="flex gap-2 mb-6">
      <input
        type="text"
        v-model="newTodo"
        @keyup.enter="addNewTask"
        @input="searchInput"
        placeholder="Add a new task..."
        class="flex-1 px-4 py-2 border-2 border-green-500 rounded-lg focus:outline-none focus:border-green-600"
      />
      <button @click="addNewTask" class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200">{{ remaining }}</button>
    </div>
    <ul class="space-y-3">
      <li v-for="(item, index) in todos" :key="index" class="slide-in bg-white p-4 rounded-lg shadow border border-gray-100 flex items-center justify-between">
        <span>{{ item }}</span>
        <button @click="handleCopy(item)">{{ copied ? 'copied' : 'copy' }}</button>
      </li>
      <li v-if="todos.length === 0" class="text-gray-500 text-center py-4">No tasks yet.</li>
    </ul>
    <div class="dark:text-white">{{ isOnline ? '已连接' : '未连接' }}</div>
    <button @click="toggleDark()" class="px-6 py-2 bg-green-500 dark:bg-gray-500 text-white rounded-lg">{{ isDark ? '亮' : '暗' }}</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useClipboard,useLocalStorage, useDebounceFn, useCountdown, useOnline, useDark, useToggle } from '@vueuse/core';

// const todos = ref<string[]>([]);
const todos = useLocalStorage<string[]>('todos', []);
const newTodo = ref<string>('');

const isOnline = useOnline();
const isDark = useDark();
const toggleDark = useToggle(isDark);
const { copy, copied, isSupported } = useClipboard()

const handleCopy = (item: string) => {
  if (isSupported.value) {
    copy(item);
    console.log('Copied:', item);
  } else {
    console.error('Clipboard not supported');
  }
};
// const countdown = ref(60);
// const canSend = ref(true);
// let timer: number | undefined = undefined;

const { remaining, start, reset } = useCountdown(60, {
  onComplete() {
    reset(60);
  },
  onTick() {
    console.log('Tick:', remaining.value);
  },
});

const addNewTask = () => {
  if (remaining.value === 60) {
    start();
  }
  // if (newTodo.value.trim()) {
  //   todos.value.push(newTodo.value.trim());
  //   newTodo.value = '';
  // }
  // if (!canSend.value) return;
  // canSend.value = false;
  // countdown.value = 60;

  // timer = setInterval(() => {
  //   countdown.value--;
  //   if (countdown.value <= 0) {
  //     clearInterval(timer);
  //     canSend.value = true;
  //     countdown.value = 60; // Reset countdown
  //   }
  // }, 1000);
};

// let debounceTimeout: ReturnType<typeof setTimeout> | null = null;
const debouncedFn = useDebounceFn((value: string) => {
  console.log(value);
}, 1000);
const searchInput = (e: InputEvent) => {
  debouncedFn((e.target as HTMLInputElement).value);
};
</script>

<style scoped>
.slide-in {
  animation: slide-in 0.3s ease-out;
  transform-origin: right;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
