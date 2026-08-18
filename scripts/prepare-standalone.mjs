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
await cp(path.join(root, 'version.json'), path.join(standaloneDir, 'version.json'), { force: true })
try {
  await cp(path.join(root, 'version.candidate.json'), path.join(standaloneDir, 'version.candidate.json'), { force: true })
} catch {
  // Candidate file is written by CI before the production workflow packages the deploy.
}

console.log('Standalone runtime assets prepared.')
