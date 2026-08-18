import { sameCommit } from './config'

export type InstalledVersion = {
  version: string
  build: string
  commit: string
  releasedAt: string
  releaseTitle: string
  releaseNotes: string[]
}

export type ReleaseCandidate = {
  version: string
  commit: string
  releaseTitle: string
  summary: string
  releaseNotes: string[]
}

export function parseBuildNumber(build: string | number | undefined | null): number {
  const value = Number.parseInt(String(build ?? '').trim(), 10)
  return Number.isFinite(value) && value > 0 ? value : 0
}

export function nextBuildNumber(installedBuild: string | number | undefined | null): string {
  return String(parseBuildNumber(installedBuild) + 1)
}

export function isUpdateAvailable(
  installed: { version?: string; commit?: string },
  candidate: { version?: string; commit?: string },
) {
  const installedCommit = installed.commit?.trim() || ''
  const candidateCommit = candidate.commit?.trim() || ''
  const installedVersion = installed.version?.trim() || ''
  const candidateVersion = candidate.version?.trim() || ''
  if (candidateCommit && installedCommit && !sameCommit(installedCommit, candidateCommit)) return true
  if (candidateVersion && installedVersion && candidateVersion !== installedVersion) return true
  if (candidateCommit && !installedCommit) return true
  return false
}

export function confirmInstalledVersion(
  installed: Pick<InstalledVersion, 'version' | 'build' | 'commit' | 'releasedAt' | 'releaseTitle' | 'releaseNotes'>,
  candidate: ReleaseCandidate,
  releasedAt = new Date().toISOString(),
): InstalledVersion {
  return {
    version: candidate.version || installed.version,
    build: nextBuildNumber(installed.build),
    commit: candidate.commit,
    releasedAt,
    releaseTitle: candidate.releaseTitle || '',
    releaseNotes: Array.isArray(candidate.releaseNotes) ? candidate.releaseNotes : [],
  }
}

export function emptyReleaseCandidate(): ReleaseCandidate {
  return { version: '', commit: '', releaseTitle: '', summary: '', releaseNotes: [] }
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string' && Boolean(item.trim()))
}

export function parseReleaseCandidate(value: unknown, commit = ''): ReleaseCandidate {
  const record = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  const notes = stringList(record.releaseNotes)
  const changes = stringList(record.changes)
  return {
    version: typeof record.version === 'string' ? record.version : '',
    commit: typeof record.commit === 'string' && record.commit ? record.commit : commit,
    releaseTitle: typeof record.releaseTitle === 'string' && record.releaseTitle
      ? record.releaseTitle
      : typeof record.title === 'string' ? record.title : '',
    summary: typeof record.summary === 'string' ? record.summary : '',
    releaseNotes: notes.length > 0 ? notes : changes,
  }
}
