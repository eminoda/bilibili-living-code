import type { HMRPayload, Plugin } from 'vite'

/**
 * 在终端打印：从文件变更到向客户端推送 HMR update 的近似耗时（服务端侧）。
 * 与 `vite --debug hmr` 配合可对照 Vite 内置日志。
 */
export function hmrLatencyPlugin(): Plugin {
  let changeAt = 0
  let changeLabel = ''
  let pendingLog = false

  return {
    name: 'hmr-latency',
    apply: 'serve',
    configureServer(server) {
      server.watcher.on('change', (file) => {
        changeAt = Date.now()
        changeLabel = file.replace(/\\/g, '/')
        pendingLog = true
        const tail = changeLabel.split('/').slice(-2).join('/')
        console.log(`\n[hmr-latency] fs change → ${tail}`)
      })

      const orig = server.ws.send.bind(server.ws) as typeof server.ws.send
      server.ws.send = (payload: HMRPayload) => {
        if (
          pendingLog &&
          changeAt &&
          (payload.type === 'update' || payload.type === 'full-reload')
        ) {
          const dt = Date.now() - changeAt
          console.log(
            `[hmr-latency] ws ${payload.type} Δ=${dt}ms (since fs change, file≈${changeLabel.split('/').pop() ?? ''})\n`,
          )
          pendingLog = false
        }
        return orig(payload)
      }
    },
  }
}
