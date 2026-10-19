import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

function zentaoRouteAlias() {
  const rewrite = (request: { url?: string }) => {
    if (request.url?.startsWith('/index.php')) request.url = `/${request.url.slice('/index.php'.length)}`
  }

  return {
    name: 'zentao-route-alias',
    configureServer(server: { middlewares: { use: (fn: (req: { url?: string }, res: unknown, next: () => void) => void) => void } }) {
      server.middlewares.use((request, _response, next) => {
        rewrite(request)
        next()
      })
    },
    configurePreviewServer(server: { middlewares: { use: (fn: (req: { url?: string }, res: unknown, next: () => void) => void) => void } }) {
      server.middlewares.use((request, _response, next) => {
        rewrite(request)
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [vue(), zentaoRouteAlias()],
  server: {
    host: '127.0.0.1',
    port: 5182,
    strictPort: true,
    proxy: { '/api.php': { target: 'http://127.0.0.1:5183', changeOrigin: true } },
  },
})
