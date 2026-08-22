import { readFile } from 'node:fs/promises'
import path from 'node:path'

export type UpdateLogEntry = {
  version: string
  build: string
  commit?: string
  releasedAt: string
  releaseTitle: string
  summary: string
  releaseNotes: string[]
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string' && Boolean(item.trim()))
}

export function emptyUpdateLogEntry(): UpdateLogEntry {
  return {
    version: '',
    build: '',
    commit: '',
    releasedAt: '',
    releaseTitle: '',
    summary: '',
    releaseNotes: [],
  }
}

export function parseUpdateLogEntry(value: unknown): UpdateLogEntry | null {
  const record = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  const version = typeof record.version === 'string' ? record.version.trim() : ''
  if (!version || version === '0.0.0') return null
  const commit = typeof record.commit === 'string' ? record.commit.trim().toLowerCase() : ''
  return {
    version,
    build: typeof record.build === 'string' ? record.build : typeof record.build === 'number' ? String(record.build) : '',
    ...(commit ? { commit } : {}),
    releasedAt: typeof record.releasedAt === 'string' && record.releasedAt
      ? record.releasedAt
      : typeof record.createdAt === 'string' ? record.createdAt : '',
    releaseTitle: typeof record.releaseTitle === 'string' && record.releaseTitle
      ? record.releaseTitle
      : typeof record.title === 'string' ? record.title : '',
    summary: typeof record.summary === 'string' ? record.summary : '',
    releaseNotes: stringList(record.releaseNotes).length > 0 ? stringList(record.releaseNotes) : stringList(record.changes),
  }
}

export function parseUpdateLog(value: unknown): UpdateLogEntry[] {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  const entries: UpdateLogEntry[] = []
  for (const item of value) {
    const entry = parseUpdateLogEntry(item)
    if (!entry) continue
    const key = entry.commit
      ? `commit:${entry.commit}`
      : `${entry.version}:${entry.build}:${entry.releasedAt}`
    if (seen.has(key)) continue
    seen.add(key)
    entries.push(entry)
  }
  return entries
}

export function toUpdateLogEntry(value: {
  version?: string
  build?: string
  commit?: string
  releasedAt?: string
  createdAt?: string
  releaseTitle?: string
  title?: string
  summary?: string
  releaseNotes?: string[]
}): UpdateLogEntry | null {
  return parseUpdateLogEntry(value)
}

export function appendSuccessfulUpdate(
  log: UpdateLogEntry[],
  previousInstalled: UpdateLogEntry | null,
  confirmed: UpdateLogEntry,
): UpdateLogEntry[] {
  const next = parseUpdateLog(log)
  if (previousInstalled?.version && previousInstalled.version !== confirmed.version) {
    const key = previousInstalled.commit
      ? `commit:${previousInstalled.commit}`
      : `${previousInstalled.version}:${previousInstalled.build}:${previousInstalled.releasedAt}`
    const exists = next.some((item) => {
      const itemKey = item.commit
        ? `commit:${item.commit}`
        : `${item.version}:${item.build}:${item.releasedAt}`
      return itemKey === key
    })
    if (!exists) next.push(previousInstalled)
  }
  return parseUpdateLog([confirmed, ...next])
}

export async function readUpdatesLogFile(appRoot: string): Promise<UpdateLogEntry[]> {
  try {
    const raw = await readFile(/* turbopackIgnore: true */ path.join(/* turbopackIgnore: true */ appRoot, 'updates-log.json'), 'utf8')
    return parseUpdateLog(JSON.parse(raw))
  } catch {
    return []
  }
}

export function mergeUpdateLog(log: UpdateLogEntry[], installed: {
  version?: string
  build?: string
  commit?: string
  releasedAt?: string
  createdAt?: string
  releaseTitle?: string
  summary?: string
  releaseNotes?: string[]
}): UpdateLogEntry[] {
  const current = toUpdateLogEntry(installed)
  if (!current) return parseUpdateLog(log)
  return parseUpdateLog([current, ...log])
}
