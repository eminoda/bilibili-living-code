import { beforeEach, describe, expect, test } from 'vitest';
import { useTodoStore } from '../todo';
import { setActivePinia, createPinia } from 'pinia';

describe('Todo Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
  test('should add a new todo item', () => {
    const todoStore = useTodoStore();
    const initialLength = todoStore.todos.length;
    todoStore.addTodo('Test Todo Item');

    expect(todoStore.todos).toHaveLength(initialLength + 1);
    expect(todoStore.todos[todoStore.todos.length - 1]).toBe('Test Todo Item');
  });
});
