import { cp, mkdir, rm, stat } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const standaloneDir = path.join(root, '.next', 'standalone')
const deployDir = path.join(root, '.deploy')

async function assertDirectory(directory) {
  try {
    if ((await stat(directory)).isDirectory()) return
  } catch {}
  throw new Error(`Standalone build directory was not found: ${directory}`)
}

await assertDirectory(standaloneDir)
await rm(deployDir, { recursive: true, force: true })
await mkdir(deployDir, { recursive: true })
await cp(standaloneDir, deployDir, {
  recursive: true,
  dereference: true,
  filter: (source) => {
    const base = path.basename(source)
    if (base === '.env' || base.startsWith('.env.')) return false
    if (base === '.git') return false
    return true
  },
})

await assertDirectory(path.join(deployDir, '.next'))
await stat(path.join(deployDir, 'server.js'))
await stat(path.join(deployDir, 'package.json'))
await stat(path.join(deployDir, 'version.json'))

console.log('Deploy directory prepared at .deploy/')
