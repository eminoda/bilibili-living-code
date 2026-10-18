import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '127.0.0.1',
    port: 5178,
    strictPort: true,
  },
  experimental: {
    // 录制对照时只切换这一项，保存后重启开发服务器。
    bundledDev: true,
  },
})
