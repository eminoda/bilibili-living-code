import { BUG_WATCH_INTERVAL_MS } from './config.mjs'
import { getMyBugs } from './getMyBugs.mjs'
import { notifyFeishuNewBugs } from './notifyFeishu.mjs'

function logWatch(message) {
  console.error(`[watchMyBugs] ${message}`)
}

export function startWatchMyBugs({
  intervalMs = BUG_WATCH_INTERVAL_MS,
  queryBugs = getMyBugs,
  notify = notifyFeishuNewBugs,
} = {}) {
  const seenIds = new Set()
  let primed = false
  let running = false

  const tick = async () => {
    if (running) return
    running = true
    try {
      logWatch('querying my bug list')
      const { bugs } = await queryBugs()
      const current = bugs.map((bug) => ({
        ...bug,
        id: String(bug.id),
      }))

      if (!primed) {
        for (const bug of current) seenIds.add(bug.id)
        primed = true
        logWatch(`baseline cached ${seenIds.size} bug id(s)`)
        return
      }

      const newcomers = current.filter((bug) => !seenIds.has(bug.id))
      for (const bug of current) seenIds.add(bug.id)

      if (!newcomers.length) return

      await notify(newcomers)
      logWatch(`notified ${newcomers.length} new bug id(s): ${newcomers.map((bug) => bug.id).join(', ')}`)
    } catch (error) {
      logWatch(error instanceof Error ? error.message : String(error))
    } finally {
      running = false
    }
  }

  tick()
  const timer = setInterval(tick, intervalMs)
  if (typeof timer.unref === 'function') timer.unref()
  logWatch(`started, interval=${intervalMs}ms`)
  return () => clearInterval(timer)
}
