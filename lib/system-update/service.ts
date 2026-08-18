import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { cp } from 'node:fs/promises'
import path from 'node:path'
import { PRODUCTION_PATHS, type UpdatePaths } from './config'
import { UpdateError, UPDATE_CODES } from './errors'
import { backupDir, createBackup, listBackups, type BackupRecord } from './backup'
import {
  downloadReleaseAsset,
  fetchLatestRelease,
  fetchReleaseByVersion,
  parseReleasePackage,
  sha256,
  verifyChecksum,
  type GithubRelease,
  type ReleasePackage,
} from './github'
import { runHealthChecks, type HealthFetcher } from './health'
import { supabaseHistory, type HistoryStore } from './history'
import { acquireLock, releaseLock } from './lock'
import { requestPassengerRestart } from './restart'
import { compareSemver, isSemver, normalizeVersion } from './semver'
import { extractZip, inspectZip } from './zip'
import { readCurrentVersion, type VersionInfo } from './version-file'

const ENV_FILES = ['.env', '.env.local', '.env.production', '.env.development', '.env.production.local']

export interface GithubClient {
  latest(): Promise<GithubRelease>
  byVersion(version: string): Promise<GithubRelease>
  download(pkg: ReleasePackage, destination: string): Promise<Buffer>
}

export interface SystemUpdateDeps {
  paths?: UpdatePaths
  github?: GithubClient
  history?: HistoryStore
  fetchHealth?: HealthFetcher
  restart?: (appRoot: string) => Promise<void>
  healthRetries?: number
  healthDelayMs?: number
}

const defaultGithub: GithubClient = {
  latest: fetchLatestRelease,
  byVersion: fetchReleaseByVersion,
  download: downloadReleaseAsset,
}

export class SystemUpdateService {
  readonly paths: UpdatePaths
  private readonly github: GithubClient
  private readonly history: HistoryStore
  private readonly fetchHealth?: HealthFetcher
  private readonly restart: (appRoot: string) => Promise<void>
  private readonly healthRetries: number
  private readonly healthDelayMs: number

  constructor(deps: SystemUpdateDeps = {}) {
    this.paths = deps.paths || PRODUCTION_PATHS
    this.github = deps.github || defaultGithub
    this.history = deps.history || supabaseHistory
    this.fetchHealth = deps.fetchHealth
    this.restart = deps.restart || requestPassengerRestart
    this.healthRetries = deps.healthRetries ?? 8
    this.healthDelayMs = deps.healthDelayMs ?? 1000
  }

  async check() {
    const current = await readCurrentVersion(this.paths)
    const release = await this.github.latest()
    const latest = parseReleasePackage(release)
    return {
      currentVersion: current.version,
      latestVersion: latest.version,
      updateAvailable: compareSemver(latest.version, current.version) > 0,
      releaseDate: latest.releaseDate,
      releaseNotes: latest.releaseNotes,
      assetName: latest.assetName,
      assetSize: latest.assetSize,
      sha256: latest.sha256,
      requiresMigration: latest.requiresMigration,
    }
  }

  async status() {
    const current = await readCurrentVersion(this.paths)
    const backups = await listBackups(this.paths.backupRoot)
    const latest = await this.history.latest()
    return {
      version: current.version,
      build: current.build,
      environment: 'production',
      nodeVersion: process.versions.node,
      lastDeployment: latest?.completed_at || current.createdAt || null,
      lastDeploymentStatus: latest?.status || null,
      backupCount: backups.length,
      backups: backups.map(({ id, version, createdAt }) => ({ id, version, createdAt })),
    }
  }

  async install(requestedVersion: string, adminUserId?: string) {
    if (!isSemver(requestedVersion)) {
      throw new UpdateError(UPDATE_CODES.INVALID_VERSION, 'Geçersiz sürüm numarası.', 400)
    }
    const version = normalizeVersion(requestedVersion)
    await acquireLock(this.paths.deployRoot)
    const historyId = await this.history.start({
      version,
      build: '',
      commit_sha: '',
      status: 'started',
      admin_user_id: adminUserId,
    })
    let backup: BackupRecord | undefined
    try {
      const release = await this.github.byVersion(version)
      const pkg = parseReleasePackage(release, version)
      const downloadPath = path.join(this.paths.downloadRoot, pkg.assetName)
      const buffer = await this.github.download(pkg, downloadPath)
      verifyChecksum(buffer, pkg.sha256)
      inspectZip(buffer)

      await rm(this.paths.stagingRoot, { recursive: true, force: true })
      await extractZip(buffer, this.paths.stagingRoot)
      const staged = await readCurrentVersion({ ...this.paths, appRoot: this.paths.stagingRoot })
      if (normalizeVersion(staged.version) !== version) {
        throw new UpdateError(UPDATE_CODES.PACKAGE_INVALID, 'Paket sürümü eşleşmiyor.', 400)
      }

      const current = await readCurrentVersion(this.paths)
      backup = await createBackup(this.paths.appRoot, this.paths.backupRoot, current.version)
      await this.deployTree(this.paths.stagingRoot, this.paths.appRoot)
      await this.restart(this.paths.appRoot)
      await runHealthChecks(this.fetchHealth, this.healthRetries, this.healthDelayMs)
      await this.history.finish(historyId, {
        status: 'success',
        build: staged.build,
        commit_sha: staged.commit,
        backup_id: backup.id,
      })
      return {
        version: staged.version,
        build: staged.build,
        backupId: backup.id,
        sha256: sha256(buffer),
      }
    } catch (error) {
      if (backup) {
        try {
          await this.restoreBackup(backup.id, false)
        } catch {
          // Original error is more important for the API contract.
        }
      }
      await this.history.finish(historyId, {
        status: 'failed',
        error_message: 'Güncelleme uygulanamadı.',
        backup_id: backup?.id || null,
      })
      throw error instanceof UpdateError
        ? error
        : new UpdateError(UPDATE_CODES.UPDATE_FAILED, 'Güncelleme uygulanamadı.', 500)
    } finally {
      await releaseLock(this.paths.deployRoot)
    }
  }

  async rollback(backupId: string, adminUserId?: string) {
    await acquireLock(this.paths.deployRoot)
    const historyId = await this.history.start({
      version: backupId,
      build: '',
      commit_sha: '',
      status: 'started',
      admin_user_id: adminUserId,
      backup_id: backupId,
    })
    try {
      const restored = await this.restoreBackup(backupId, true)
      await this.history.finish(historyId, {
        status: 'rolled_back',
        build: restored.build,
        backup_id: backupId,
      })
      return restored
    } catch (error) {
      await this.history.finish(historyId, {
        status: 'failed',
        error_message: 'Geri alma uygulanamadı.',
        backup_id: backupId,
      })
      throw error instanceof UpdateError
        ? error
        : new UpdateError(UPDATE_CODES.UPDATE_FAILED, 'Geri alma uygulanamadı.', 500)
    } finally {
      await releaseLock(this.paths.deployRoot)
    }
  }

  private async restoreBackup(backupId: string, checkHealth: boolean): Promise<VersionInfo> {
    const source = backupDir(this.paths.backupRoot, backupId)
    try {
      await readFile(/* turbopackIgnore: true */ path.join(/* turbopackIgnore: true */ source, 'server.js'))
    } catch {
      throw new UpdateError(UPDATE_CODES.BACKUP_NOT_FOUND, 'Yedek bulunamadı.', 404)
    }
    await this.deployTree(source, this.paths.appRoot, false)
    await this.restart(this.paths.appRoot)
    if (checkHealth) await runHealthChecks(this.fetchHealth, this.healthRetries, this.healthDelayMs)
    return readCurrentVersion(this.paths)
  }

  private async deployTree(source: string, destination: string, preserveEnv = true) {
    const saved = preserveEnv ? await this.readEnvFiles(destination) : []
    await mkdir(destination, { recursive: true })
    await cp(/* turbopackIgnore: true */ source, destination, {
      recursive: true,
      force: true,
      dereference: true,
      filter: (from) => !path.basename(from).startsWith('.backup-meta'),
    })
    for (const file of saved) {
      await writeFile(path.join(destination, file.name), file.content)
    }
  }

  private async readEnvFiles(appRoot: string) {
    const saved: { name: string; content: Buffer }[] = []
    for (const name of ENV_FILES) {
      try {
        saved.push({ name, content: await readFile(/* turbopackIgnore: true */ path.join(/* turbopackIgnore: true */ appRoot, name)) })
      } catch {
        // File does not exist on this host.
      }
    }
    return saved
  }
}

let shared: SystemUpdateService | undefined

export function getSystemUpdateService() {
  shared ||= new SystemUpdateService()
  return shared
}
