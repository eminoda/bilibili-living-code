<template>
  <div class="todo-app">
    <h1 class="title">Todo List</h1>
    <div class="input-group">
      <input
        type="text"
        v-model="newTodo"
        @keyup.enter="addNewTask"
        placeholder="Add a new task..."
        class="todo-input"
      />
      <button @click="addNewTask" class="add-btn">Add</button>
    </div>
    <ul class="todo-list">
      <li v-for="(item, index) in todos" :key="index" class="todo-item">
        <span>{{ item }}</span>
      </li>
      <li v-if="todos.length === 0" class="empty">No tasks yet.</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const todos = ref<string[]>([]);
const newTodo = ref<string>('');

const addNewTask = () => {
  if (newTodo.value.trim()) {
    todos.value.push(newTodo.value.trim());
    newTodo.value = '';
  }
};
</script>

<style scoped>
.todo-app {
  max-width: 400px;
  margin: 60px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px 0 #e0e0e0;
  padding: 32px 24px 24px 24px;
}

.title {
  text-align: center;
  color: #333;
  margin-bottom: 24px;
  font-size: 2rem;
  font-weight: 700;
}

.input-group {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.todo-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
}
.todo-input:focus {
  border-color: #42b983;
}

.add-btn {
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0 18px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.add-btn:hover {
  background: #36976b;
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.todo-item {
  background: #f7f7f7;
  margin-bottom: 10px;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 1rem;
  color: #444;
  display: flex;
  align-items: center;
}
.empty {
  text-align: center;
  color: #aaa;
  font-size: 1rem;
  margin-top: 16px;
}
</style>
