import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { hmrLatencyPlugin } from './vite-plugin-hmr-latency'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), UnoCSS(), hmrLatencyPlugin()],
})
