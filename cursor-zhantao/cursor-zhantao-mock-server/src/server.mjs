import { randomUUID } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { mockData } from './data.mjs'

const host = process.env.HOST ?? '127.0.0.1'
const port = Number(process.env.PORT ?? 5183)
const basePath = '/api.php/v2'
const sessions = new Map()
const createdBugsFile = new URL('../.created-bugs.json', import.meta.url)
const createdBugs = await readFile(createdBugsFile, 'utf8').then(JSON.parse).catch((error) => {
  if (error.code === 'ENOENT') return []
  throw error
})
if (!Array.isArray(createdBugs)) throw new Error('Created Bug data must be an array.')
for (const bug of createdBugs) {
  if (!mockData.bugs.some((item) => item.id === bug.id)) mockData.bugs.push(bug)
}

const taskFields = [
  'id', 'project', 'parent', 'isParent', 'isTpl', 'path', 'execution', 'module', 'design', 'story', 'storyVersion',
  'designVersion', 'fromBug', 'feedback', 'fromIssue', 'docs', 'docVersions', 'name', 'type', 'mode', 'pri', 'estimate',
  'consumed', 'left', 'deadline', 'status', 'subStatus', 'color', 'mailto', 'keywords', 'desc', 'version', 'openedBy',
  'openedDate', 'assignedTo', 'assignedDate', 'estStarted', 'realStarted', 'finishedBy', 'finishedDate', 'finishedList',
  'canceledBy', 'canceledDate', 'closedBy', 'closedDate', 'planDuration', 'realDuration', 'closedReason', 'lastEditedBy',
  'lastEditedDate', 'activatedDate', 'order', 'repo', 'mr', 'entry', 'lines', 'v1', 'v2', 'vision', 'deleted', 'storyID',
  'storyTitle', 'product', 'branch', 'latestStoryVersion', 'storyStatus', 'priOrder', 'statusOrder', 'designName',
  'latestDesignVersion', 'assignedToRealName', 'delay', 'needConfirm', 'productType', 'cases', 'progress', 'rawParent',
  'confirmeObject', 'URs', 'relatedObject',
]
const taskNullFields = new Set(['realStarted', 'finishedDate', 'canceledDate', 'closedDate', 'activatedDate'])
const taskNumberFields = new Set(['delay', 'progress', 'relatedObject'])
const taskBooleanFields = new Set(['needConfirm'])
const taskArrayFields = new Set(['cases', 'confirmeObject'])

const bugFields = [
  'id', 'project', 'product', 'injection', 'identify', 'branch', 'module', 'execution', 'plan', 'story', 'storyVersion',
  'task', 'toTask', 'toStory', 'title', 'keywords', 'severity', 'pri', 'type', 'os', 'browser', 'hardware', 'found',
  'steps', 'status', 'subStatus', 'color', 'confirmed', 'activatedCount', 'activatedDate', 'feedbackBy', 'notifyEmail',
  'mailto', 'openedBy', 'openedDate', 'openedBuild', 'assignedTo', 'assignedDate', 'deadline', 'resolvedBy', 'resolution',
  'resolvedBuild', 'resolvedDate', 'closedBy', 'closedDate', 'duplicateBug', 'relatedBug', 'case', 'caseVersion', 'feedback',
  'result', 'repo', 'mr', 'entry', 'lines', 'v1', 'v2', 'repoType', 'issueKey', 'testtask', 'lastEditedBy', 'lastEditedDate',
  'deleted', 'priOrder', 'severityOrder', 'needconfirm', 'confirmeObject', 'URs', 'relatedObject',
]
const bugDetailFields = [
  ...bugFields.filter((field) => !['priOrder', 'severityOrder', 'needconfirm', 'confirmeObject', 'URs', 'relatedObject'].includes(field)),
  'executionName', 'storyTitle', 'storyStatus', 'latestStoryVersion', 'taskName', 'planName', 'projectName',
  'injectionTitle', 'identifyTitle', 'linkMRTitles', 'toCases', 'files',
]
const bugArrayFields = new Set(['confirmeObject', 'linkMRTitles', 'toCases', 'files'])
const bugBooleanFields = new Set(['needconfirm'])
const bugNumberFields = new Set(['relatedObject'])

const storyFields = [
  'id', 'parent', 'isParent', 'root', 'path', 'grade', 'product', 'branch', 'module', 'plan', 'source', 'sourceNote',
  'fromBug', 'feedback', 'title', 'keywords', 'type', 'category', 'pri', 'estimate', 'status', 'subStatus', 'color', 'stage',
  'stagedBy', 'mailto', 'lib', 'fromStory', 'fromVersion', 'openedBy', 'openedDate', 'assignedTo', 'assignedDate',
  'approvedDate', 'lastEditedBy', 'lastEditedDate', 'changedBy', 'changedDate', 'reviewedBy', 'reviewedDate', 'releasedDate',
  'closedBy', 'closedDate', 'closedReason', 'activatedDate', 'toBug', 'linkStories', 'linkRequirements', 'docs', 'twins',
  'duplicateStory', 'version', 'parentVersion', 'demandVersion', 'storyChanged', 'feedbackBy', 'notifyEmail', 'BSA',
  'duration', 'demand', 'submitedBy', 'roadmap', 'URChanged', 'unlinkReason', 'retractedReason', 'retractedBy',
  'retractedDate', 'verifiedDate', 'vision', 'frozen', 'deleted', 'priOrder', 'planTitle', 'originParent', 'relatedObject',
  'reviewer', 'notReview', 'confirmeObject', 'URs', 'needSummaryEstimate',
]
const requirementFields = storyFields.filter((field) => !['confirmeObject', 'URs'].includes(field))
const testcaseFields = [
  'id', 'project', 'product', 'execution', 'branch', 'lib', 'module', 'path', 'story', 'storyVersion', 'title',
  'precondition', 'keywords', 'pri', 'type', 'auto', 'frame', 'stage', 'howRun', 'script', 'scriptedBy', 'scriptedDate',
  'scriptStatus', 'scriptLocation', 'status', 'subStatus', 'color', 'frequency', 'order', 'openedBy', 'openedDate',
  'reviewedBy', 'reviewedDate', 'lastEditedBy', 'lastEditedDate', 'version', 'linkCase', 'fromBug', 'fromCaseID',
  'fromCaseVersion', 'lastRunner', 'lastRunDate', 'lastRunResult', 'scene', 'sort', 'deleted', 'storyTitle', 'storyDeleted',
  'needconfirm', 'bugs', 'results', 'caseFails', 'stepNumber', 'confirmeObject', 'URs', 'relatedObject', 'caseID', 'parent', 'isScene',
]

function projectFields(record, fields, { arrays = [], booleans = [], numbers = [] } = {}) {
  const output = {}
  for (const field of fields) {
    if (arrays.includes(field)) output[field] = Array.isArray(record[field]) ? record[field] : []
    else if (booleans.includes(field)) output[field] = Boolean(record[field] ?? false)
    else if (numbers.includes(field)) output[field] = Number(record[field] ?? 0)
    else if (field === 'parent' && (fields === storyFields || fields === requirementFields)) output[field] = Array.isArray(record[field]) ? record[field] : []
    else output[field] = String(record[field] ?? '')
  }
  return output
}

function projectStory(story) {
  return projectFields(story, storyFields, { arrays: ['parent', 'reviewer', 'notReview', 'confirmeObject'], booleans: ['needSummaryEstimate'], numbers: ['relatedObject'] })
}

function projectRequirement(requirement) {
  return projectFields(requirement, requirementFields, { arrays: ['parent', 'reviewer', 'notReview'], booleans: ['needSummaryEstimate'], numbers: ['relatedObject'] })
}

function projectTestcase(testcase) {
  return projectFields(testcase, testcaseFields, { arrays: ['confirmeObject'], booleans: ['needconfirm', 'isScene'], numbers: ['bugs', 'results', 'caseFails', 'relatedObject', 'parent'] })
}

function send(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  })
  response.end(JSON.stringify(payload))
}

function fail(response, statusCode, message) {
  send(response, statusCode, { status: 'fail', message })
}

async function readJson(request) {
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > 1_000_000) throw new Error('Request body is too large.')
    chunks.push(chunk)
  }
  if (!chunks.length) return {}
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw new Error('Request body must be valid JSON.')
  }
}

function pagination(searchParams) {
  const recPerPage = Number(searchParams.get('recPerPage') ?? 20)
  const pageID = Number(searchParams.get('pageID') ?? 1)
  if (!Number.isInteger(recPerPage) || recPerPage < 1 || recPerPage > 1000) return { error: 'recPerPage must be an integer from 1 to 1000.' }
  if (!Number.isInteger(pageID) || pageID < 1) return { error: 'pageID must be an integer greater than or equal to 1.' }
  return { recPerPage, pageID }
}

function paginate(items, page) {
  const start = (page.pageID - 1) * page.recPerPage
  return items.slice(start, start + page.recPerPage)
}

function sortItems(items, orderBy, allowed, fields) {
  if (!orderBy) return items
  if (!allowed.includes(orderBy)) return null
  const descending = orderBy.endsWith('_desc')
  const key = orderBy.slice(0, -4).replace(/_$/, '')
  const field = fields[key]
  const sorted = [...items].sort((left, right) => String(left[field] ?? '').localeCompare(String(right[field] ?? ''), undefined, { numeric: true, sensitivity: 'base' }))
  return descending ? sorted.reverse() : sorted
}

function projectTask(task) {
  const output = {}
  for (const field of taskFields) {
    if (taskNullFields.has(field)) output[field] = task[field] ?? null
    else if (taskNumberFields.has(field)) output[field] = Number(task[field] ?? 0)
    else if (taskBooleanFields.has(field)) output[field] = Boolean(task[field] ?? false)
    else if (taskArrayFields.has(field)) output[field] = Array.isArray(task[field]) ? task[field] : []
    else output[field] = String(task[field] ?? '')
  }
  return output
}

function projectBug(bug, detail = false) {
  const fields = detail ? bugDetailFields : bugFields
  const output = {}
  for (const field of fields) {
    if (bugArrayFields.has(field)) output[field] = Array.isArray(bug[field]) ? bug[field] : []
    else if (bugBooleanFields.has(field)) output[field] = Boolean(bug[field] ?? false)
    else if (bugNumberFields.has(field)) output[field] = Number(bug[field] ?? 0)
    else output[field] = String(bug[field] ?? '')
  }
  return output
}

function taskMatchesStatus(task, status, user) {
  if (status === 'all') return true
  if (status === 'unclosed') return !['done', 'closed', 'cancel'].includes(task.status)
  if (status === 'assignedtome') return task.assignedTo.toLowerCase() === user.toLowerCase()
  if (status === 'myinvolved') return task.assignedTo.toLowerCase() === user.toLowerCase() || task.openedBy.toLowerCase() === user.toLowerCase()
  if (status === 'assignedbyme') return (task.assignedBy ?? 'boss').toLowerCase() === user.toLowerCase()
  return false
}

function bugMatchesType(bug, browseType, user) {
  if (browseType === 'all') return true
  if (browseType === 'unclosed' || browseType === 'unresolved') return !['resolved', 'closed'].includes(bug.status)
  if (browseType === 'assigntome') return bug.assignedTo.toLowerCase() === user.toLowerCase()
  if (browseType === 'openedbyme') return bug.openedBy.toLowerCase() === user.toLowerCase()
  if (browseType === 'assignedbyme') return (bug.assignedBy ?? 'boss').toLowerCase() === user.toLowerCase()
  return false
}

function matchesStoryType(story, browseType, user) {
  if (browseType === 'allstory') return true
  if (browseType === 'assignedtome') return story.assignedTo.toLowerCase() === user.toLowerCase()
  if (browseType === 'openedbyme') return story.openedBy.toLowerCase() === user.toLowerCase()
  if (browseType === 'reviewbyme') return (story.reviewer ?? []).some((account) => account.toLowerCase() === user.toLowerCase())
  if (browseType === 'draftstory') return story.status === 'draft'
  return !['closed', 'done', 'cancel'].includes(story.status)
}

function matchesTestcaseType(testcase, browseType) {
  if (browseType === 'all') return true
  if (browseType === 'wait') return testcase.status === 'wait'
  if (browseType === 'needconfirm') return testcase.needconfirm === true
  return false
}

function dateNow() {
  return new Date().toISOString().slice(0, 10)
}

function dateTimeNow() {
  return new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Shanghai', hour12: false })
}

function handleDemoHistory(request, response, url) {
  const match = url.pathname.match(/^\/api\.php\/mock\/bugs\/(\d+)\/history$/)
  if (!match) return false
  if (request.method !== 'GET') {
    fail(response, 405, 'Only GET is supported for mock Bug history.')
    return true
  }
  const token = request.headers.token
  if (typeof token !== 'string' || !sessions.has(token)) {
    fail(response, 401, 'Missing or invalid mock Token. POST /api.php/v2/users/login first.')
    return true
  }
  if (!mockData.bugs.some((bug) => bug.id === match[1])) {
    fail(response, 404, `Bug ${match[1]} was not found.`)
    return true
  }
  send(response, 200, { status: 'success', history: mockData.bugHistory[match[1]] ?? [] })
  return true
}

function handleApi(request, response, url) {
  const path = decodeURIComponent(url.pathname)
  if (!path.startsWith(`${basePath}/`)) return false
  const route = path.slice(basePath.length)

  if (request.method === 'POST' && route === '/users/login') {
    readJson(request).then((body) => {
      if (typeof body.account !== 'string' || !body.account.trim() || typeof body.password !== 'string' || !body.password) {
        fail(response, 400, 'account and password are required in this mock service.')
        return
      }
      const token = `mock-${randomUUID()}`
      sessions.set(token, body.account.trim())
      send(response, 200, { status: 'success', token })
    }).catch((error) => fail(response, 400, error.message))
    return true
  }

  const token = request.headers.token
  const currentUser = typeof token === 'string' ? sessions.get(token) : undefined
  if (!currentUser) {
    fail(response, 401, 'Missing or invalid mock Token. POST /api.php/v2/users/login first.')
    return true
  }

  const { products, executions, projects, tasks, bugs, bugHistory, stories, requirements, testcases } = mockData

  if (request.method === 'POST' && route === '/bugs') {
    readJson(request).then(async (body) => {
      const fieldTypes = {
        productID: 'integer', title: 'string', openedBuild: 'array', project: 'integer',
        execution: 'integer', severity: 'integer', pri: 'integer', type: 'string',
        steps: 'string', story: 'integer',
      }
      for (const [field, value] of Object.entries(body)) {
        if (!fieldTypes[field]) return fail(response, 400, `Unsupported Bug field: ${field}.`)
        if (fieldTypes[field] === 'integer' && (!Number.isInteger(value) || value < 0)) return fail(response, 400, `${field} must be a non-negative integer.`)
        if (fieldTypes[field] === 'string' && typeof value !== 'string') return fail(response, 400, `${field} must be a string.`)
        if (fieldTypes[field] === 'array' && (!Array.isArray(value) || !value.length || value.some((item) => typeof item !== 'string' || !item.trim()))) return fail(response, 400, `${field} must be a non-empty array of strings.`)
      }
      if (!Number.isInteger(body.productID) || body.productID < 1 || !products.some((item) => item.id === String(body.productID))) return fail(response, 400, 'productID must identify an existing product.')
      if (typeof body.title !== 'string' || !body.title.trim()) return fail(response, 400, 'title is required.')
      if (!Array.isArray(body.openedBuild) || !body.openedBuild.length) return fail(response, 400, 'openedBuild is required.')
      if (body.project !== undefined && !projects.some((item) => item.id === String(body.project))) return fail(response, 400, 'project must identify an existing project.')
      if (body.execution !== undefined && !executions.some((item) => item.id === String(body.execution))) return fail(response, 400, 'execution must identify an existing execution.')
      const allowedTypes = ['codeerror', 'config', 'install', 'security', 'performance', 'standard', 'automation', 'designdefect', 'others']
      if (body.type !== undefined && !allowedTypes.includes(body.type)) return fail(response, 400, 'Unsupported Bug type.')

      const execution = executions.find((item) => item.id === String(body.execution))
      const now = dateTimeNow()
      const id = Math.max(0, ...bugs.map((item) => Number(item.id) || 0)) + 1
      const bug = {
        id: String(id), product: String(body.productID), project: String(body.project ?? execution?.project ?? ''),
        execution: String(body.execution ?? ''), module: '', title: body.title.trim(),
        severity: String(body.severity ?? 3), pri: String(body.pri ?? 3), type: body.type ?? 'codeerror',
        status: 'active', confirmed: '0', openedBy: currentUser,
        openedByRealName: { boss: '老板', frontend: '前端雨爸', amino: 'Eminoda' }[currentUser] ?? currentUser,
        openedDate: now, openedBuild: body.openedBuild.join(','),
        assignedTo: 'frontend', assignedToRealName: '前端雨爸', assignedDate: now,
        steps: body.steps ?? '', result: '', lastEditedDate: now,
        activatedCount: '0', activatedDate: '', repo: '', mr: '', entry: '', lines: '',
        story: String(body.story ?? 0),
      }
      createdBugs.push(bug)
      try {
        await writeFile(createdBugsFile, `${JSON.stringify(createdBugs, null, 2)}\n`, 'utf8')
      } catch (error) {
        createdBugs.pop()
        throw error
      }
      bugs.push(bug)
      send(response, 200, { status: 'success', id })
    }).catch((error) => fail(response, 400, error.message))
    return true
  }

  const page = pagination(url.searchParams)
  if (page.error && request.method === 'GET' && ['/projects', '/products', '/executions'].includes(route)) {
    fail(response, 400, page.error)
    return true
  }

  if (request.method === 'GET' && route === '/projects') {
    send(response, 200, { status: 'success', projects: paginate(projects, page) })
    return true
  }
  if (request.method === 'GET' && route === '/products') {
    // The product-list page documents the values but not its default; keep the mock unfiltered when omitted.
    const browseType = url.searchParams.get('browseType') ?? 'all'
    if (!['all', 'noclosed', 'closed'].includes(browseType)) return fail(response, 400, 'browseType must be all, noclosed, or closed.'), true
    const matching = browseType === 'closed' ? products.filter((item) => item.status === 'closed') : browseType === 'noclosed' ? products.filter((item) => item.status !== 'closed') : products
    send(response, 200, { status: 'success', products: paginate(matching, page) })
    return true
  }
  if (request.method === 'GET' && route === '/executions') {
    const status = url.searchParams.get('status') ?? 'undone'
    const statusMap = { all: () => true, undone: (item) => !['closed', 'done', 'cancel'].includes(item.status), wait: (item) => item.status === 'wait', doing: (item) => item.status === 'doing' }
    if (!statusMap[status]) return fail(response, 400, 'status must be all, undone, wait, or doing.'), true
    const sorted = sortItems(executions.filter(statusMap[status]), url.searchParams.get('orderBy'), ['rawID_asc', 'rawID_desc', 'nameCol_asc', 'nameCol_desc', 'begin_asc', 'begin_desc', 'end_asc', 'end_desc'], { rawID: 'id', nameCol: 'name', begin: 'begin', end: 'end' })
    if (!sorted) return fail(response, 400, 'Unsupported orderBy for executions.'), true
    send(response, 200, { status: 'success', executions: paginate(sorted, page) })
    return true
  }

  const executionTasks = route.match(/^\/executions\/(\d+)\/tasks$/)
  if (request.method === 'GET' && executionTasks) {
    const status = url.searchParams.get('status') ?? 'unclosed'
    if (!['all', 'unclosed', 'assignedtome', 'myinvolved', 'assignedbyme'].includes(status)) return fail(response, 400, 'Unsupported task status filter.'), true
    const matching = tasks.filter((task) => task.execution === executionTasks[1] && taskMatchesStatus(task, status, currentUser))
    const sorted = sortItems(matching, url.searchParams.get('orderBy'), ['id_asc', 'id_desc', 'name_asc', 'name_desc', 'status_asc', 'status_desc'], { id: 'id', name: 'name', status: 'status' })
    if (!sorted) return fail(response, 400, 'Unsupported orderBy for tasks.'), true
    send(response, 200, { status: 'success', tasks: paginate(sorted, page).map(projectTask) })
    return true
  }

  const taskDetail = route.match(/^\/tasks\/(\d+)$/)
  if (request.method === 'GET' && taskDetail) {
    const task = tasks.find((item) => item.id === taskDetail[1])
    if (!task) fail(response, 404, `Task ${taskDetail[1]} was not found.`)
    else send(response, 200, { status: 'success' })
    return true
  }

  const productStories = route.match(/^\/products\/(\d+)\/stories$/)
  if (request.method === 'GET' && productStories) {
    const browseType = url.searchParams.get('browseType') ?? 'unclosed'
    if (!['allstory', 'assignedtome', 'openedbyme', 'reviewbyme', 'draftstory', 'unclosed'].includes(browseType)) return fail(response, 400, 'Unsupported product stories browseType.'), true
    const matching = stories.filter((story) => story.product === productStories[1] && matchesStoryType(story, browseType, currentUser))
    const sorted = sortItems(matching, url.searchParams.get('orderBy'), ['id_asc', 'id_desc', 'title_asc', 'title_desc', 'status_asc', 'status_desc'], { id: 'id', title: 'title', status: 'status' })
    if (!sorted) return fail(response, 400, 'Unsupported orderBy for product stories.'), true
    send(response, 200, { status: 'success', stories: paginate(sorted, page).map(projectStory) })
    return true
  }

  const productRequirements = route.match(/^\/products\/(\d+)\/requirements$/)
  if (request.method === 'GET' && productRequirements) {
    const browseType = url.searchParams.get('browseType') ?? 'unclosed'
    if (!['allstory', 'assignedtome', 'openedbyme', 'reviewbyme', 'draftstory', 'unclosed'].includes(browseType)) return fail(response, 400, 'Unsupported product requirements browseType.'), true
    const matching = requirements.filter((requirement) => requirement.product === productRequirements[1] && matchesStoryType(requirement, browseType, currentUser))
    const sorted = sortItems(matching, url.searchParams.get('orderBy'), ['id_asc', 'id_desc', 'title_asc', 'title_desc', 'status_asc', 'status_desc'], { id: 'id', title: 'title', status: 'status' })
    if (!sorted) return fail(response, 400, 'Unsupported orderBy for product requirements.'), true
    send(response, 200, { status: 'success', requirements: paginate(sorted, page).map(projectRequirement) })
    return true
  }

  const productTestcases = route.match(/^\/products\/(\d+)\/testcases$/)
  if (request.method === 'GET' && productTestcases) {
    const browseType = url.searchParams.get('browseType') ?? 'all'
    if (!['all', 'wait', 'needconfirm'].includes(browseType)) return fail(response, 400, 'browseType must be all, wait, or needconfirm for product testcases.'), true
    const matching = testcases.filter((testcase) => testcase.product === productTestcases[1] && matchesTestcaseType(testcase, browseType))
    const sorted = sortItems(matching, url.searchParams.get('orderBy'), ['id_asc', 'id_desc', 'title_asc', 'title_desc', 'status_asc', 'status_desc'], { id: 'id', title: 'title', status: 'status' })
    if (!sorted) return fail(response, 400, 'Unsupported orderBy for product testcases.'), true
    send(response, 200, { status: 'success', testcases: paginate(sorted, page).map(projectTestcase) })
    return true
  }

  const productBugs = route.match(/^\/products\/(\d+)\/bugs$/)
  if (request.method === 'GET' && productBugs) {
    const browseType = url.searchParams.get('browseType') ?? 'unclosed'
    if (!['all', 'unclosed', 'assigntome', 'openedbyme', 'assignedbyme'].includes(browseType)) return fail(response, 400, 'Unsupported product Bug browseType.'), true
    const matching = bugs.filter((bug) => bug.product === productBugs[1] && bugMatchesType(bug, browseType, currentUser))
    const sorted = sortItems(matching, url.searchParams.get('orderBy'), ['id_asc', 'id_desc', 'title_asc', 'title_desc', 'status_asc', 'status_desc'], { id: 'id', title: 'title', status: 'status' })
    if (!sorted) return fail(response, 400, 'Unsupported orderBy for product Bugs.'), true
    send(response, 200, { status: 'success', bugs: paginate(sorted, page).map((bug) => projectBug(bug)) })
    return true
  }

  const projectBugs = route.match(/^\/projects\/(\d+)\/bugs$/)
  if (request.method === 'GET' && projectBugs) {
    const browseType = url.searchParams.get('browseType') ?? 'all'
    if (!['all', 'unresolved'].includes(browseType)) return fail(response, 400, 'browseType must be all or unresolved for project Bugs.'), true
    const matching = bugs.filter((bug) => bug.project === projectBugs[1] && bugMatchesType(bug, browseType, currentUser))
    const sorted = sortItems(matching, url.searchParams.get('orderBy'), ['id_asc', 'id_desc', 'title_asc', 'title_desc', 'status_asc', 'status_desc'], { id: 'id', title: 'title', status: 'status' })
    if (!sorted) return fail(response, 400, 'Unsupported orderBy for project Bugs.'), true
    send(response, 200, { status: 'success', bugs: paginate(sorted, page).map((bug) => projectBug(bug)) })
    return true
  }

  const bugDetail = route.match(/^\/bugs\/(\d+)$/)
  if (request.method === 'GET' && bugDetail) {
    const bug = bugs.find((item) => item.id === bugDetail[1])
    if (!bug) fail(response, 404, `Bug ${bugDetail[1]} was not found.`)
    else send(response, 200, { status: 'success', bug: projectBug(bug, true) })
    return true
  }

  const bugAction = route.match(/^\/bugs\/(\d+)\/(resolve|close|activate)$/)
  const bugUpdate = route.match(/^\/bugs\/(\d+)$/)
  if (request.method === 'PUT' && (bugAction || bugUpdate)) {
    readJson(request).then((body) => {
      const bugID = (bugAction ?? bugUpdate)[1]
      const bug = bugs.find((item) => item.id === bugID)
      if (!bug) return fail(response, 404, `Bug ${bugID} was not found.`)

      if (bugUpdate) {
        const fields = {
          title: 'string', severity: 'number', pri: 'number', type: 'string', openedBuild: 'array', steps: 'string',
          project: 'number', execution: 'number', story: 'number',
        }
        for (const [field, value] of Object.entries(body)) {
          if (!fields[field]) return fail(response, 400, `Unsupported Bug field: ${field}.`)
          if (fields[field] === 'string' && typeof value !== 'string') return fail(response, 400, `${field} must be a string.`)
          if (fields[field] === 'number' && !Number.isFinite(Number(value))) return fail(response, 400, `${field} must be numeric.`)
          if (fields[field] === 'array' && (!Array.isArray(value) || value.some((item) => typeof item !== 'string'))) return fail(response, 400, `${field} must be an array of strings.`)
        }
        for (const [field, value] of Object.entries(body)) bug[field] = ['severity', 'pri', 'project', 'execution', 'story'].includes(field) ? String(value) : field === 'openedBuild' ? value.join(',') : value
      } else {
        const action = bugAction[2]
        const allowedByAction = {
          resolve: { resolution: 'string', resolvedDate: 'string', resolvedBuild: 'string', assignedTo: 'string', comment: 'string' },
          close: { comment: 'string' },
          activate: { openedBuild: 'array', assignedTo: 'string', comment: 'string' },
        }[action]
        for (const [field, value] of Object.entries(body)) {
          if (!allowedByAction[field]) return fail(response, 400, `Unsupported ${action} field: ${field}.`)
          if (allowedByAction[field] === 'string' && typeof value !== 'string') return fail(response, 400, `${field} must be a string.`)
          if (allowedByAction[field] === 'array' && (!Array.isArray(value) || value.some((item) => typeof item !== 'string'))) return fail(response, 400, `${field} must be an array of strings.`)
        }
        if (action === 'resolve') {
          const resolutions = ['fixed', 'notrepro', 'bydesign', 'duplicate', 'external', 'postponed', 'willnotfix', 'tostory']
          if (!resolutions.includes(body.resolution)) return fail(response, 400, `resolution must be one of: ${resolutions.join(', ')}.`)
          bug.status = 'resolved'
          bug.resolution = body.resolution
          bug.resolvedBy = currentUser
          bug.resolvedDate = body.resolvedDate || dateNow()
          bug.resolvedBuild = body.resolvedBuild || ''
          if (body.assignedTo !== undefined) bug.assignedTo = String(body.assignedTo)
        }
        if (action === 'close') {
          bug.status = 'closed'
          bug.closedBy = currentUser
          bug.closedDate = dateNow()
        }
        if (action === 'activate') {
          if (body.openedBuild !== undefined && !Array.isArray(body.openedBuild)) return fail(response, 400, 'openedBuild must be an array.')
          bug.status = 'active'
          bug.activatedCount = String(Number(bug.activatedCount || 0) + 1)
          bug.activatedDate = dateNow()
          if (body.openedBuild) bug.openedBuild = body.openedBuild.join(',')
          if (body.assignedTo !== undefined) bug.assignedTo = String(body.assignedTo)
        }
      }
      bug.lastEditedBy = currentUser
      bug.lastEditedDate = dateTimeNow()
      if (bugAction) {
        const history = bugHistory[bugID] ?? (bugHistory[bugID] = [])
        history.push({
          id: randomUUID(),
          action: bugAction[2],
          actor: currentUser,
          date: bug.lastEditedDate,
          comment: body.comment ?? '',
        })
      }
      send(response, 200, { status: 'success' })
    }).catch((error) => fail(response, 400, error.message))
    return true
  }

  send(response, 404, { status: 'fail', message: `No mock route for ${request.method} ${route}.` })
  return true
}

const server = createServer((request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? `${host}:${port}`}`)
  if (handleDemoHistory(request, response, url)) return
  if (handleApi(request, response, url)) return
  send(response, 404, { status: 'fail', message: 'Use the documented /api.php/v2 routes.' })
})

server.listen(port, host, () => {
  console.log(`禅道 RESTful API v2 Mock Server listening at http://${host}:${port}`)
  console.log(`API base path: http://${host}:${port}${basePath}`)
})
