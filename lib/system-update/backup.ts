import { mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { cp } from 'node:fs/promises'
import { MAX_BACKUPS } from './config'
import { UpdateError, UPDATE_CODES } from './errors'

const BACKUP_ID = /^[A-Za-z0-9._-]+$/

export interface BackupRecord {
  id: string
  version: string
  createdAt: string
}

export function backupIdFromName(name: string) {
  if (!BACKUP_ID.test(name) || name.includes('..') || name.includes('/') || name.includes('\\')) {
    throw new UpdateError(UPDATE_CODES.INVALID_BACKUP, 'Geçersiz yedek kimliği.', 400)
  }
  return name
}

export async function createBackup(appRoot: string, backupRoot: string, version: string) {
  const createdAt = new Date().toISOString().replace(/[:.]/g, '-')
  const id = `${version}-${createdAt}`
  const destination = path.join(backupRoot, id)
  await mkdir(backupRoot, { recursive: true })
  await cp(/* turbopackIgnore: true */ appRoot, destination, { recursive: true, force: true, dereference: true, filter: excludeDeployments })
  await writeFile(path.join(destination, '.backup-meta.json'), JSON.stringify({ id, version, createdAt: new Date().toISOString() }))
  await pruneBackups(backupRoot)
  return { id, version, createdAt: new Date().toISOString() }
}

export async function listBackups(backupRoot: string): Promise<BackupRecord[]> {
  try {
    const entries = await readdir(backupRoot, { withFileTypes: true })
    const backups = await Promise.all(entries.filter((entry) => entry.isDirectory() && BACKUP_ID.test(entry.name)).map(async (entry) => {
      const info = await stat(path.join(backupRoot, entry.name))
      const version = entry.name.split('-')[0] || 'unknown'
      return { id: entry.name, version, createdAt: info.mtime.toISOString() }
    }))
    return backups.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  } catch {
    return []
  }
}

export function backupDir(backupRoot: string, backupId: string) {
  const id = backupIdFromName(backupId)
  return path.join(backupRoot, id)
}

export async function pruneBackups(backupRoot: string) {
  const backups = await listBackups(backupRoot)
  for (const extra of backups.slice(MAX_BACKUPS)) {
    await rm(path.join(backupRoot, extra.id), { recursive: true, force: true })
  }
}

function excludeDeployments(source: string) {
  return !source.includes(`${path.sep}deployments${path.sep}`) && !source.endsWith(`${path.sep}deployments`)
}
