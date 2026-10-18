import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { hmrLatencyPlugin } from './vite-plugin-hmr-latency'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), vue(), hmrLatencyPlugin()],
})
