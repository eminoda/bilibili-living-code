/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { useTodoQuery } from '../todo.api';
import axios from 'axios';
import { mount } from '@vue/test-utils';
import { VueQueryPlugin } from '@tanstack/vue-query';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockedAxiosGet = vi.mocked(axios.get);
describe('Todo API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should fetch todo items', async () => {
    // 模拟后端列表接口
    const mockTodos = ['Todo 1', 'Todo 2', 'Todo 3'];

    mockedAxiosGet.mockResolvedValueOnce({
      data: {
        code: 0,
        list: mockTodos,
      },
    });

    // 创建 vue component
    const TestComponent = {
      template: '<div></div>',
      setup() {
        return useTodoQuery();
      },
    };

    const app = mount(TestComponent, {
      global: {
        plugins: [VueQueryPlugin],
      },
    });

    // 等待异步请求完成
    await vi.waitFor(
      () => {
        expect(app.vm.isSuccess).toBe(true);
      },
      {
        timeout: 3000,
      }
    );
  });
});
