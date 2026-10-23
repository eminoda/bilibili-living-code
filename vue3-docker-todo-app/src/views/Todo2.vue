<template>
  <div class="max-w-xl mx-auto p-6 mt-10">
    <h1 class="text-3xl font-bold text-blue-500 mb-6 text-center">Todo List</h1>
    <div class="flex gap-2 mb-6">
      <input
        type="text"
        v-model="newTodo"
        @keyup.enter="addNewTask"
        placeholder="Add a new task..."
        class="flex-1 px-4 py-2 border-2 border-blue-500 rounded-lg focus:outline-none focus:border-blue-600"
      />
      <button
        @click="addNewTask"
        class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
      >
        Add
      </button>
    </div>
    <div v-if="isPending" class="mb-4 text-center text-gray-500">Loading tasks...</div>
    <div v-else-if="error" class="mb-4 text-center text-red-500">{{ error.message }}</div>
    <div v-else-if="isFetching && !isFetchingNextPage" class="mb-4 text-center text-gray-500">Refreshing tasks...</div>
    <ul class="space-y-3">
      <li
        v-for="(item, index) in data?.pages.flatMap((page) => page.data)"
        :key="index"
        class="slide-in bg-white p-4 rounded-lg shadow border border-gray-100 flex items-center"
      >
        {{ item.title }}
      </li>
      <!-- <li
        v-if="data && data.length === 0"
        class="text-gray-500 text-center py-4"
      >
        No tasks yet.
      </li> -->
    </ul>
    <!-- <div v-if="isError">
      {{ error?.message }}
    </div> -->
    <button
      v-if="hasNextPage"
      type="button"
      @click="onLoadMore"
      :disabled="isFetchingNextPage"
      class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
    >
      <span v-if="isFetchingNextPage">Loading more...</span>
      <span v-else>Load More</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useTodoStore } from "../stores/todo";
import { useInfiniteQuery } from "@tanstack/vue-query";
import axios from "axios";

const { addTodo } = useTodoStore();
const newTodo = ref<string>("");
const addNewTask = () => {
  if (newTodo.value.trim()) {
    addTodo(newTodo.value.trim());
    newTodo.value = "";
  }
};

const enabled = ref(false);

setTimeout(() => {
  enabled.value = true;
}, 1000);

const {
  data,
  error,
  fetchNextPage,
  hasNextPage,
  isFetching,
  isFetchingNextPage,
  isPending,
} = useInfiniteQuery({
  initialPageParam: 1,
  enabled,
  queryKey: ["todos2"],
  queryFn: async ({ pageParam = 1 }) => {
    const { data } = await axios.get("/api/todos", {
      params: {
        pageNum: pageParam,
        pageSize: 3,
      },
    });
    if (data.code === 0) {
      return {
        nextCursor: pageParam * 3 >= data.total ? undefined : pageParam + 1,
        data: data.list,
      };
    } else {
      throw new Error("Error fetching todos");
    }
  },
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});

const onLoadMore = () => {
  fetchNextPage();
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
