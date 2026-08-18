import { mkdir, open, readFile, rm, stat } from 'node:fs/promises'
import path from 'node:path'
import { LOCK_STALE_MS } from './config'
import { UpdateError, UPDATE_CODES } from './errors'

export function lockPath(deployRoot: string) {
  return path.join(deployRoot, '.update.lock')
}

export async function acquireLock(deployRoot: string) {
  await mkdir(deployRoot, { recursive: true })
  const file = lockPath(deployRoot)
  try {
    const handle = await open(file, 'wx')
    await handle.writeFile(JSON.stringify({ pid: process.pid, startedAt: Date.now() }))
    await handle.close()
    return file
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error
    if (await isLockStale(file)) {
      await rm(file, { force: true })
      return acquireLock(deployRoot)
    }
    throw new UpdateError(UPDATE_CODES.CONFLICT, 'Bir güncelleme zaten çalışıyor.', 409)
  }
}

export async function releaseLock(deployRoot: string) {
  await rm(lockPath(deployRoot), { force: true })
}

async function isLockStale(file: string) {
  try {
    const raw = JSON.parse(await readFile(file, 'utf8')) as { pid?: number; startedAt?: number }
    if (raw.startedAt && Date.now() - raw.startedAt > LOCK_STALE_MS) return true
    if (typeof raw.pid === 'number') {
      try {
        process.kill(raw.pid, 0)
        return false
      } catch {
        return true
      }
    }
    return Date.now() - (await stat(file)).mtimeMs > LOCK_STALE_MS
  } catch {
    return true
  }
}
