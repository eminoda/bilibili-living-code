import { defineStore } from "pinia";
import { ref } from "vue";

export const useTodoState = defineStore(
  "todo",
  () => {
    const todos = ref<Array<string>>([]);
    function addTodo(todo: string) {
      todos.value.push(todo);
    }

    return { todos, addTodo };
  },
  {
    persist: true,
  }
);
