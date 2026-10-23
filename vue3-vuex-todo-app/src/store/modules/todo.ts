import type { Module } from "vuex";

// 为 store state 声明类型
export interface TodoState {
  todoList: Array<string>;
  currentTodo: string;
}

const todo: Module<TodoState, unknown> = {
  namespaced: true,
  state: (): TodoState => {
    return {
      currentTodo: "",
      todoList: [],
    };
  },
  getters: {},
  mutations: {
    setTodoList(state: TodoState, item: string) {
      state.currentTodo = item;
      state.todoList = [...state.todoList, item];
    },
  },
  actions: {
    saveTodoList({ commit }, item: string) {
      commit("setTodoList", item);
    },
  },
};

export default todo;
