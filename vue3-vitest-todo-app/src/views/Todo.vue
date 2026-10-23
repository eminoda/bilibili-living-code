<template>
  <div class="max-w-xl mx-auto p-6 mt-10">
    <h1 class="text-3xl font-bold text-green-500 mb-6 text-center">
      Todo List
    </h1>
    <div class="flex gap-2 mb-6">
      <input
        type="text"
        v-model="newTodo"
        @keyup.enter="addNewTask"
        placeholder="Add a new task..."
        class="flex-1 px-4 py-2 border-2 border-green-500 rounded-lg focus:outline-none focus:border-green-600"
      />
      <button
        @click="addNewTask"
        class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
      >
        Add
      </button>
    </div>
    <div v-if="isPending" class="mb-4 text-center text-gray-500">Loading tasks...</div>
    <div v-else-if="isFetching" class="mb-4 text-center text-gray-500">Refreshing tasks...</div>
    <ul class="space-y-3">
      <li
        v-for="(item, index) in data"
        :key="index"
        class="slide-in bg-white p-4 rounded-lg shadow border border-gray-100 flex items-center"
      >
        {{ item.title }}
      </li>
      <li
        v-if="data && data.length === 0"
        class="text-gray-500 text-center py-4"
      >
        No tasks yet.
      </li>
    </ul>
    <div v-if="isError">
      {{ error?.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axios from "axios";
import { useTodoQuery } from "../api/todo.api";

const newTodo = ref<string>("");

// const addNewTask = () => {
//   if (newTodo.value.trim()) {
//     addTodo(newTodo.value.trim());
//     newTodo.value = "";
//   }
// };

const { isPending, isFetching, isError, data, error } = useTodoQuery();

const queryClient = useQueryClient();

const { mutate } = useMutation({
  mutationFn: (newTodo: string) =>
    axios.post("/api/todos", {
      title: newTodo,
    }),
  onMutate: async (newTodo: string) => {
    await queryClient.cancelQueries({ queryKey: ["todos"] });
    const previousTodos = queryClient.getQueryData<any[]>(["todos"]);
    queryClient.setQueryData<any[]>(["todos"], (old) => [
      { title: newTodo },
      ...((old as any[]) || []),
    ]);
    return { previousTodos };
  },
  onSuccess: () => {},
  onError: (_err, _newTodo, context) => {
    queryClient.setQueryData<any[]>(["todos"], context?.previousTodos);
  },
});

const addNewTask = () => {
  const newTask = newTodo.value.trim();
  if (newTask) {
    mutate(newTask);
  }
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
