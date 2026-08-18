import { cp, mkdir, rm, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
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

async function hoistPnpmPackages(nodeModulesDir) {
  const pnpmDir = path.join(nodeModulesDir, '.pnpm')
  if (!existsSync(pnpmDir)) return 0
  const { readdirSync } = await import('node:fs')
  let copied = 0
  for (const storeName of readdirSync(pnpmDir)) {
    const storeModules = path.join(pnpmDir, storeName, 'node_modules')
    if (!existsSync(storeModules)) continue
    for (const entry of readdirSync(storeModules, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue
      const source = path.join(storeModules, entry.name)
      if (entry.name.startsWith('@') && entry.isDirectory()) {
        for (const scoped of readdirSync(source, { withFileTypes: true })) {
          const scopedSource = path.join(source, scoped.name)
          const dest = path.join(nodeModulesDir, entry.name, scoped.name)
          if (existsSync(dest)) continue
          await mkdir(path.dirname(dest), { recursive: true })
          await cp(scopedSource, dest, { recursive: true, dereference: true, force: true })
          copied += 1
        }
        continue
      }
      const dest = path.join(nodeModulesDir, entry.name)
      if (existsSync(dest)) continue
      await cp(source, dest, { recursive: true, dereference: true, force: true })
      copied += 1
    }
  }
  return copied
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

const hoisted = await hoistPnpmPackages(path.join(deployDir, 'node_modules'))
await assertDirectory(path.join(deployDir, '.next'))
await stat(path.join(deployDir, 'server.js'))
await stat(path.join(deployDir, 'package.json'))
await stat(path.join(deployDir, 'version.json'))
await assertDirectory(path.join(deployDir, 'node_modules', '@swc', 'helpers'))
await assertDirectory(path.join(deployDir, 'node_modules', '@next', 'env'))

console.log(`Deploy directory prepared at .deploy/ (hoisted ${hoisted} packages)`)
