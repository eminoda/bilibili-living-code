import { execFile } from 'node:child_process'
import { access } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import { isMainModule, readCliValue } from './cli.mjs'

const execFileAsync = promisify(execFile)

const DEFAULT_COMMIT_LIMIT = 8
const MAX_DIFF_CHARS = 8000
const MAX_COMMENT_CHARS = 3500
const SENSITIVE_NAME = /(?:^|[/\\])(?:\.env(?:\..+)?|\.zentao-token|credentials\.json|id_rsa|\.pem)$/i

function quote(value) {
  return String(value ?? '').trim()
}

function isSensitivePath(filePath) {
  return SENSITIVE_NAME.test(String(filePath).replaceAll('\\', '/'))
}

async function pathExists(target) {
  try {
    await access(target)
    return true
  } catch {
    return false
  }
}

export async function findGitRoot(startDir) {
  let current = path.resolve(startDir)
  while (true) {
    if (await pathExists(path.join(current, '.git'))) {
      return current
    }
    const parent = path.dirname(current)
    if (parent === current) {
      throw new Error(`No git repository found from ${path.resolve(startDir)}.`)
    }
    current = parent
  }
}

async function git(gitRoot, args) {
  try {
    const { stdout } = await execFileAsync('git', ['-C', gitRoot, ...args], {
      encoding: 'utf8',
      windowsHide: true,
      maxBuffer: 4 * 1024 * 1024,
    })
    return stdout.replace(/\u0000/g, '').trimEnd()
  } catch (error) {
    const detail = quote(error.stderr) || quote(error.message)
    throw new Error(`git ${args.join(' ')} failed: ${detail}`)
  }
}

function parseCommits(raw) {
  if (!raw.trim()) return []
  return raw.split('\u001e').map((record) => record.trim()).filter(Boolean).map((record) => {
    const [hash = '', subject = '', author = '', date = '', body = ''] = record.split('\u001f')
    return {
      hash,
      shortHash: hash.slice(0, 7),
      subject: subject.trim(),
      author: author.trim(),
      date: date.trim(),
      body: body.trim(),
    }
  })
}

function parseNumstat(raw) {
  const files = []
  for (const line of raw.split('\n')) {
    if (!line.trim()) continue
    const [insertions, deletions, ...pathParts] = line.split('\t')
    const filePath = pathParts.join('\t')
    if (!filePath || isSensitivePath(filePath)) continue
    files.push({
      path: filePath,
      insertions: insertions === '-' ? null : Number(insertions),
      deletions: deletions === '-' ? null : Number(deletions),
    })
  }
  return files
}

function parseChangePoints(diff) {
  const points = []
  let currentFile = ''
  for (const line of diff.split('\n')) {
    const fileMatch = line.match(/^diff --git a\/(.+) b\/(.+)$/)
    if (fileMatch) {
      currentFile = fileMatch[2]
      continue
    }
    const hunkMatch = line.match(/^@@ -\d+(?:,\d+)? \+\d+(?:,\d+)? @@(.*)$/)
    if (!hunkMatch || !currentFile || isSensitivePath(currentFile)) continue
    const context = hunkMatch[1].trim()
    const label = context ? `${currentFile} · ${context}` : currentFile
    if (!points.includes(label)) points.push(label)
  }
  return points
}

function splitDiffs(diff) {
  if (!diff.trim()) return ''
  const chunks = diff.split(/(?=^diff --git )/m)
  return chunks.filter((chunk) => {
    const fileMatch = chunk.match(/^diff --git a\/(.+) b\/(.+)$/m)
    if (!fileMatch) return true
    return !isSensitivePath(fileMatch[1]) && !isSensitivePath(fileMatch[2])
  }).join('')
}

function truncate(text, maxChars) {
  if (text.length <= maxChars) return { text, truncated: false }
  return { text: `${text.slice(0, maxChars)}\n...[truncated]`, truncated: true }
}

function commitMatchesBug(commit, bugId) {
  if (!bugId) return true
  const haystack = `${commit.subject}\n${commit.body}`
  return haystack.includes(bugId) || haystack.includes(`#${bugId}`)
}

function mergeFiles(...groups) {
  const filesByPath = new Map()
  for (const file of groups.flat()) {
    filesByPath.set(file.path, file)
  }
  return [...filesByPath.values()]
}

function buildComment({ bugId, branch, commits, files, changePoints, uncommitted }) {
  const lines = []
  lines.push(bugId ? `修复 Bug ${bugId}` : '本次代码修改说明')
  if (branch) lines.push(`分支：${branch}`)

  if (commits.length) {
    lines.push('', '相关提交：')
    for (const commit of commits) {
      lines.push(`- ${commit.shortHash} ${commit.subject}（${commit.author}，${commit.date}）`)
    }
  }

  if (uncommitted) {
    lines.push('', '包含尚未提交的工作区或暂存区改动。')
  }

  if (files.length) {
    lines.push('', '修改文件：')
    for (const file of files) {
      const plus = file.insertions == null ? '-' : `+${file.insertions}`
      const minus = file.deletions == null ? '-' : `-${file.deletions}`
      lines.push(`- ${file.path} (${plus}/${minus})`)
    }
  }

  if (changePoints.length) {
    lines.push('', '修改点：')
    for (const point of changePoints.slice(0, 20)) {
      lines.push(`- ${point}`)
    }
  }

  if (!commits.length && !files.length) {
    lines.push('', '本地 git 未找到可对应的提交或 diff，无法从仓库解析本次修改说明。')
  }

  return truncate(lines.join('\n'), MAX_COMMENT_CHARS).text
}

/**
 * Read local git commits and diffs, then build a comment for fix_bug.
 */
export async function getBugCommitContext({
  bugId,
  cwd = process.env.ZENTAO_GIT_ROOT || process.cwd(),
  commitLimit = DEFAULT_COMMIT_LIMIT,
} = {}) {
  const gitRoot = await findGitRoot(cwd)
  const branch = await git(gitRoot, ['rev-parse', '--abbrev-ref', 'HEAD'])
  const status = await git(gitRoot, ['status', '--porcelain'])

  const logRaw = await git(gitRoot, [
    'log',
    `-n${String(commitLimit)}`,
    '--date=iso',
    '--pretty=format:%H%x1f%s%x1f%an%x1f%ad%x1f%b%x1e',
  ])
  const recentCommits = parseCommits(logRaw)
  const matchedCommits = bugId
    ? recentCommits.filter((commit) => commitMatchesBug(commit, bugId))
    : recentCommits
  const commits = matchedCommits.length ? matchedCommits : recentCommits.slice(0, Math.min(3, recentCommits.length))

  const unstagedDiff = splitDiffs(await git(gitRoot, ['diff']))
  const stagedDiff = splitDiffs(await git(gitRoot, ['diff', '--cached']))
  const uncommittedDiff = [stagedDiff, unstagedDiff].filter(Boolean).join('\n')
  const committedDiff = !uncommittedDiff && commits[0]
    ? splitDiffs(await git(gitRoot, ['show', '--format=', '--patch', commits[0].hash]))
    : ''
  const diffSource = uncommittedDiff ? 'working-tree' : (committedDiff ? 'latest-commit' : 'none')
  const rawDiff = uncommittedDiff || committedDiff
  const { text: diff, truncated: diffTruncated } = truncate(rawDiff, MAX_DIFF_CHARS)

  const unstagedFiles = parseNumstat(await git(gitRoot, ['diff', '--numstat']))
  const stagedFiles = parseNumstat(await git(gitRoot, ['diff', '--cached', '--numstat']))
  const commitFiles = !uncommittedDiff && commits[0]
    ? parseNumstat(await git(gitRoot, ['show', '--format=', '--numstat', commits[0].hash]))
    : []
  const files = mergeFiles(stagedFiles, unstagedFiles, commitFiles)
  const changePoints = parseChangePoints(rawDiff)

  const comment = buildComment({
    bugId,
    branch,
    commits,
    files,
    changePoints,
    uncommitted: Boolean(uncommittedDiff),
  })

  return {
    gitRoot,
    branch,
    bugId: bugId || null,
    diffSource,
    hasUncommittedChanges: Boolean(status.trim()),
    commits,
    files,
    changePoints,
    diffTruncated,
    diff,
    comment,
  }
}

async function runCli() {
  const result = await getBugCommitContext({
    bugId: readCliValue('--bug-id') || readCliValue('--id'),
    cwd: readCliValue('--cwd') || process.env.ZENTAO_GIT_ROOT,
  })
  console.log(JSON.stringify({ ok: true, ...result }, null, 2))
}

if (isMainModule(import.meta.url)) {
  runCli().catch((error) => {
    console.error(error.message)
    console.error('Usage: node src/getBugCommitContext.mjs [--bug-id <id>] [--cwd <git-root-or-subdir>]')
    process.exitCode = 1
  })
}
