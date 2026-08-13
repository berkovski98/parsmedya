import { cp, mkdir, stat } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const standaloneDir = path.join(root, '.next', 'standalone')

async function assertDirectory(directory) {
  try {
    if ((await stat(directory)).isDirectory()) return
  } catch {}

  throw new Error(`Standalone build directory was not found: ${directory}`)
}

await assertDirectory(standaloneDir)
await mkdir(path.join(standaloneDir, '.next'), { recursive: true })
await cp(path.join(root, '.next', 'static'), path.join(standaloneDir, '.next', 'static'), {
  recursive: true,
  force: true,
})
await cp(path.join(root, 'public'), path.join(standaloneDir, 'public'), {
  recursive: true,
  force: true,
})

console.log('Standalone runtime assets prepared.')
