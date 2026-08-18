import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { UpdatePaths } from './config'

export interface VersionInfo {
  version: string
  build: string
  commit: string
  createdAt: string
}

export function emptyVersionInfo(): VersionInfo {
  return { version: '0.0.0', build: '', commit: '', createdAt: '' }
}

export async function readVersionFile(appRoot: string): Promise<VersionInfo> {
  try {
    const raw = await readFile(/* turbopackIgnore: true */ path.join(/* turbopackIgnore: true */ appRoot, 'version.json'), 'utf8')
    const parsed = JSON.parse(raw) as Partial<VersionInfo>
    if (!parsed.version || typeof parsed.version !== 'string') return emptyVersionInfo()
    return {
      version: parsed.version,
      build: typeof parsed.build === 'string' ? parsed.build : '',
      commit: typeof parsed.commit === 'string' ? parsed.commit : '',
      createdAt: typeof parsed.createdAt === 'string' ? parsed.createdAt : '',
    }
  } catch {
    return emptyVersionInfo()
  }
}

export async function readCurrentVersion(paths: UpdatePaths) {
  return readVersionFile(paths.appRoot)
}
