import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/vue';
import { page } from 'vitest/browser';

import { createPinia } from 'pinia';
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';

import Todo from '../../src/views/Todo.vue';
import router from '../../src/router';
import axios from 'axios';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedAxios = vi.mocked(axios);

describe('Todo E2E Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  // 测试页面加载
  test('should page loaded', async () => {
    const pinia = createPinia();

    render(Todo, {
      global: {
        plugins: [pinia, router, VueQueryPlugin],
      },
    });

    await expect.element(page.getByText('Todo List')).toBeVisible();
  });

  // 测试列表加载
  test('should todo list', async () => {
    const pinia = createPinia();

    mockedAxios.get.mockResolvedValue({
      data: {
        code: 0,
        list: [
          {
            title: 'todo1',
          },
          {
            title: 'todo2',
          },
        ],
      },
    });

    render(Todo, {
      global: {
        plugins: [pinia, router, VueQueryPlugin],
      },
    });

    await expect.element(page.getByText('todo1')).toBeVisible();
    await expect.element(page.getByText('todo2')).toBeVisible();

    const todoItems = await screen.getAllByRole('listitem');
    const visibleTodos = todoItems.filter((item) => {
      const text = item.textContent || '';
      return text && !text.includes('No tasks yet.');
    });

    expect(visibleTodos).toHaveLength(2);
    expect(mockedAxios.get).toHaveBeenCalled();
  });

  test('should add todo', async () => {
    const pinia = createPinia();
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    mockedAxios.get.mockResolvedValue({
      data: {
        code: 0,
        list: [
          {
            title: 'todo1',
          },
        ],
      },
    });

    // 添加成功
    mockedAxios.post.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => {
            resolve({
              data: {
                code: 0,
              },
            });
          }, 100)
        )
    );

    render(Todo, {
      global: {
        plugins: [pinia, router, [VueQueryPlugin, { queryClient }]],
      },
    });

    await expect.element(page.getByText('todo1')).toBeVisible();

    const input = page.getByPlaceholder('Add a new task...');
    await input.fill('todo2');

    const addButton = page.getByRole('button', { name: 'Add' });
    await addButton.click();

    // 乐观更新
    await expect.element(page.getByText('todo2')).toBeVisible();
    await expect.element(page.getByText('todo1')).toBeVisible();
  });
});
