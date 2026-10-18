import { FEISHU_HOOK_URL } from './config.mjs'

function formatAssignedTo(assignedTo) {
  if (!assignedTo) return '-'
  if (typeof assignedTo === 'string') return assignedTo
  return assignedTo.realname || assignedTo.account || String(assignedTo.id ?? '-')
}

export function buildNewBugPostPayload(bugs) {
  const count = bugs.length
  const lines = bugs.map((bug) => {
    const assignedTo = formatAssignedTo(bug.assignedTo)
    return `#${bug.id}  ${bug.title || '(无标题)'}  状态=${bug.status || '-'}  优先级=${bug.pri ?? '-'}  严重程度=${bug.severity ?? '-'}  指派=${assignedTo}`
  })

  return {
    msg_type: 'post',
    content: {
      post: {
        zh_cn: {
          title: `禅道新 Bug 提醒（${count}）`,
          content: [
            [{ tag: 'text', text: `发现 ${count} 个新指派给你的 Bug，请及时处理。` }],
            [{ tag: 'text', text: '' }],
            ...lines.map((line) => [{ tag: 'text', text: line }]),
          ],
        },
      },
    },
  }
}

export async function notifyFeishuNewBugs(bugs, { hookUrl = FEISHU_HOOK_URL } = {}) {
  if (!bugs.length) return { skipped: true }

  const response = await fetch(hookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildNewBugPostPayload(bugs)),
  })
  const text = await response.text()
  let payload = {}
  try {
    payload = text ? JSON.parse(text) : {}
  } catch {
    throw new Error(`Feishu hook returned non-JSON: ${text.slice(0, 200)}`)
  }

  if (!response.ok || (payload.code !== undefined && payload.code !== 0)) {
    throw new Error(payload.msg || payload.StatusMessage || `Feishu hook failed: ${response.status}`)
  }
  return payload
}
