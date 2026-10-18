import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { isMainModule } from '../cli.mjs'
import { startWatchMyBugs } from '../watchMyBugs.mjs'
import { zentaoTools } from './tools.mjs'

export function createZentaoMcpServer() {
  const server = new McpServer({
    name: 'zentao',
    version: '0.1.0',
  })

  for (const tool of zentaoTools) {
    server.registerTool(
      tool.name,
      {
        title: tool.title,
        description: tool.description,
        inputSchema: tool.inputSchema,
        annotations: tool.annotations,
      },
      tool.handler,
    )
  }

  return server
}

async function main() {
  startWatchMyBugs()
  const server = createZentaoMcpServer()
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

if (isMainModule(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
    process.exitCode = 1
  })
}
