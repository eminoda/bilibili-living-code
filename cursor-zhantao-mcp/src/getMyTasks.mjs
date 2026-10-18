import { isMainModule } from './cli.mjs'
import { DEFAULT_BASE_URL, TOKEN_FILE } from './config.mjs'
import { fetchAllPages } from './pagedList.mjs'
import { loadToken } from './tokenStore.mjs'

/**
 * Query tasks assigned to the current token user.
 * Uses saved token only; does not accept or store account/password.
 */
export async function getMyTasks({
  baseUrl = DEFAULT_BASE_URL,
  tokenFile = TOKEN_FILE,
  status = 'assignedtome',
} = {}) {
  const token = await loadToken(tokenFile)
  const executions = await fetchAllPages('/executions?status=undone', {
    token,
    baseUrl,
    listKey: 'executions',
  })

  const taskPages = await Promise.all(
    executions.map((execution) => fetchAllPages(
      `/executions/${encodeURIComponent(execution.id)}/tasks?status=${encodeURIComponent(status)}`,
      { token, baseUrl, listKey: 'tasks' },
    )),
  )

  const tasksById = new Map()
  for (const task of taskPages.flat()) {
    tasksById.set(String(task.id), task)
  }

  return {
    tasks: [...tasksById.values()],
    executionCount: executions.length,
  }
}

async function runCli() {
  const result = await getMyTasks()
  console.log(JSON.stringify({
    ok: true,
    executionCount: result.executionCount,
    taskCount: result.tasks.length,
    tasks: result.tasks.map((task) => ({
      id: task.id,
      name: task.name,
      status: task.status,
      assignedTo: task.assignedTo,
      execution: task.execution,
      project: task.project,
      pri: task.pri,
      deadline: task.deadline,
    })),
  }, null, 2))
}

if (isMainModule(import.meta.url)) {
  runCli().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
