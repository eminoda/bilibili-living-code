import { isMainModule, readCliValue } from './cli.mjs'
import { apiUrl, DEFAULT_BASE_URL, TOKEN_FILE } from './config.mjs'
import { requestJson } from './http.mjs'
import { fetchAllPages } from './pagedList.mjs'
import { loadToken } from './tokenStore.mjs'

async function findTaskInExecutions({ taskId, token, baseUrl }) {
  const executions = await fetchAllPages('/executions?status=all', {
    token,
    baseUrl,
    listKey: 'executions',
  })

  const taskPages = await Promise.all(
    executions.map((execution) => fetchAllPages(
      `/executions/${encodeURIComponent(execution.id)}/tasks?status=all`,
      { token, baseUrl, listKey: 'tasks' },
    )),
  )

  return taskPages.flat().find((task) => String(task.id) === String(taskId)) || null
}

/**
 * Fetch a task by ID using the saved token.
 * Official GET /tasks/:taskID only documents `{ status }`.
 * When the detail payload has no task object, look it up from execution task lists.
 */
export async function getTaskDetail({
  taskId,
  baseUrl = DEFAULT_BASE_URL,
  tokenFile = TOKEN_FILE,
} = {}) {
  if (!taskId) {
    throw new Error('getTaskDetail requires taskId.')
  }

  const token = await loadToken(tokenFile)
  const payload = await requestJson({
    url: apiUrl(`/tasks/${encodeURIComponent(taskId)}`, baseUrl),
    token,
  })

  if (payload.task) {
    return { task: payload.task, source: 'detail' }
  }

  const task = await findTaskInExecutions({ taskId, token, baseUrl })
  if (!task) {
    throw new Error(`Task ${taskId} was not found.`)
  }

  return { task, source: 'execution-list' }
}

async function runCli() {
  const taskId = readCliValue('--task-id') || readCliValue('--id')
  const result = await getTaskDetail({ taskId })
  console.log(JSON.stringify({
    ok: true,
    source: result.source,
    task: result.task,
  }, null, 2))
}

if (isMainModule(import.meta.url)) {
  runCli().catch((error) => {
    console.error(error.message)
    console.error('Usage: node src/getTaskDetail.mjs --task-id <id>')
    process.exitCode = 1
  })
}
