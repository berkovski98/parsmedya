import { readFile } from 'node:fs/promises'
import path from 'node:path'

export interface VersionInfo {
  version: string
  build: string
  commit: string
  createdAt: string
  releasedAt: string
  releaseTitle: string
  releaseNotes: string[]
}

export function emptyVersionInfo(): VersionInfo {
  return {
    version: '0.0.0',
    build: '',
    commit: '',
    createdAt: '',
    releasedAt: '',
    releaseTitle: '',
    releaseNotes: [],
  }
}

export function parseVersionInfo(value: unknown): VersionInfo {
  const empty = emptyVersionInfo()
  const record = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  if (typeof record.version !== 'string' || !record.version) return empty
  const releasedAt = typeof record.releasedAt === 'string' && record.releasedAt
    ? record.releasedAt
    : typeof record.createdAt === 'string' ? record.createdAt : ''
  const notes = Array.isArray(record.releaseNotes)
    ? record.releaseNotes.filter((item): item is string => typeof item === 'string')
    : []
  return {
    version: record.version,
    build: typeof record.build === 'string' ? record.build : typeof record.build === 'number' ? String(record.build) : '',
    commit: typeof record.commit === 'string' ? record.commit : '',
    createdAt: releasedAt,
    releasedAt,
    releaseTitle: typeof record.releaseTitle === 'string' ? record.releaseTitle : '',
    releaseNotes: notes,
  }
}

export async function readVersionFile(appRoot: string): Promise<VersionInfo> {
  try {
    const raw = await readFile(/* turbopackIgnore: true */ path.join(/* turbopackIgnore: true */ appRoot, 'version.json'), 'utf8')
    return parseVersionInfo(JSON.parse(raw))
  } catch {
    return emptyVersionInfo()
  }
}
