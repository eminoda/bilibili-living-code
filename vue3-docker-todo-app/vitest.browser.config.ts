import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    // 只测试 e2e 测试文件
    include: ['test/e2e/**/*.test.ts'],
    browser: {
      enabled: true,
      provider: playwright(),
      // https://vitest.dev/guide/browser/playwright
      instances: [
         { browser: 'chromium' },
      ],
    },
  },
});
