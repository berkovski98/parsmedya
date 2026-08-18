import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const file = path.join(process.cwd(), 'version.json')
let current = { version: '1.1.0' }
try {
  current = JSON.parse(await readFile(file, 'utf8'))
} catch {
  // Keep the default version when the file is missing.
}

const next = {
  version: typeof current.version === 'string' && current.version ? current.version : '1.1.0',
  commit: process.env.GITHUB_SHA || '',
  build: String(process.env.GITHUB_RUN_NUMBER || ''),
  createdAt: new Date().toISOString(),
}

await mkdir(path.dirname(file), { recursive: true })
await writeFile(file, `${JSON.stringify(next, null, 2)}\n`)
console.log(`Wrote version.json ${next.version} ${next.commit.slice(0, 7)} #${next.build}`)
