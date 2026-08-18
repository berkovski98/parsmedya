import { isCommitSha, sameCommit } from './config'
import { UPDATE_CODES, UpdateError } from './errors'
import {
  githubActions,
  isActiveRun,
  mapDeployProgress,
  mapWorkflowState,
  type GithubActionsClient,
} from './github'
import { supabaseHistory, type HistoryStore } from './history'
import { readVersionFile, type VersionInfo } from './version-file'

export interface SystemUpdateDeps {
  github?: GithubActionsClient
  history?: HistoryStore
  readVersion?: () => Promise<VersionInfo>
  appRoot?: string
}

export class SystemUpdateService {
  private readonly github: GithubActionsClient
  private readonly history: HistoryStore
  private readonly readVersion: () => Promise<VersionInfo>
  private dispatchPending = false
  private pendingSince = 0

  constructor(deps: SystemUpdateDeps = {}) {
    this.github = deps.github || githubActions
    this.history = deps.history || supabaseHistory
    this.readVersion = deps.readVersion || (() => readVersionFile(deps.appRoot || process.cwd()))
  }

  async check() {
    const current = await this.readVersion()
    const latest = await this.github.latestMainCommit()
    return {
      currentCommit: current.commit,
      latestCommit: latest.sha,
      updateAvailable: !sameCommit(current.commit, latest.sha),
      latestMessage: latest.message,
      latestDate: latest.date,
      latestAuthor: latest.author,
      currentVersion: current.version,
    }
  }

  async status() {
    const current = await this.readVersion()
    const previous = await this.previousCommit(current.commit)
    const idle = {
      status: 'completed' as const,
      conclusion: null,
      phase: 'idle' as const,
      phaseLabel: '',
      progress: 0,
      runId: null,
      commit: current.commit,
      startedAt: null,
      updatedAt: null,
      completedAt: null,
      url: null,
      version: current.version,
      build: current.build,
      currentCommit: current.commit,
      previousCommit: previous,
      nodeVersion: process.versions.node,
      errorMessage: null as string | null,
    }
    try {
      const runs = await this.github.listWorkflowRuns()
      this.releaseDispatchGuard(runs)
      const latestRun = runs[0] || null
      const activeRun = runs.find(isActiveRun) || (latestRun && isActiveRun(latestRun) ? latestRun : null)
      const run = activeRun || latestRun
      const steps = run ? await this.github.listJobSteps(run.id) : []
      const state = mapWorkflowState(run)
      const progress = mapDeployProgress(run, steps)
      const history = await this.history.latest()
      return {
        ...idle,
        status: state.status,
        conclusion: state.conclusion,
        phase: progress.phase,
        phaseLabel: progress.phaseLabel,
        progress: progress.progress,
        runId: run?.id || null,
        commit: run?.head_sha || current.commit,
        startedAt: run?.created_at || null,
        updatedAt: run?.updated_at || null,
        completedAt: state.status === 'completed' ? (run?.updated_at || history?.completed_at || null) : null,
        url: run?.html_url || null,
        errorMessage: progress.errorMessage,
      }
    } catch {
      return idle
    }
  }

  async install(adminUserId?: string) {
    this.beginDispatch()
    try {
      await this.assertIdle()
      const check = await this.check()
      if (!check.updateAvailable) {
        throw new UpdateError(UPDATE_CODES.NO_UPDATE, 'Yeni bir güncelleme yok.', 409)
      }
      await this.github.dispatch()
      await this.history.start({
        version: check.currentVersion,
        build: '',
        commit_sha: check.latestCommit,
        status: 'queued',
        admin_user_id: adminUserId,
      })
      return { status: 'queued' as const, commit: check.latestCommit }
    } catch (error) {
      this.dispatchPending = false
      throw error
    }
  }

  async rollback(commitSha: string, adminUserId?: string) {
    const sha = commitSha.trim().toLowerCase()
    if (!isCommitSha(sha)) {
      throw new UpdateError(UPDATE_CODES.INVALID_SHA, 'Geçersiz commit SHA.', 400)
    }
    this.beginDispatch()
    try {
      await this.assertIdle()
      if (!await this.history.hasSuccessfulCommit(sha)) {
        throw new UpdateError(UPDATE_CODES.COMMIT_NOT_FOUND, 'Bu commit başarılı bir dağıtım kaydı değil.', 404)
      }
      if (!await this.github.commitExists(sha)) {
        throw new UpdateError(UPDATE_CODES.COMMIT_NOT_FOUND, 'Bu commit bu depoda yok.', 404)
      }
      const current = await this.readVersion()
      if (sameCommit(current.commit, sha)) {
        throw new UpdateError(UPDATE_CODES.NO_UPDATE, 'Seçilen sürüm zaten yüklü.', 409)
      }
      await this.github.dispatch(sha)
      await this.history.start({
        version: current.version,
        build: '',
        commit_sha: sha,
        status: 'queued',
        admin_user_id: adminUserId,
      })
      return { status: 'queued' as const, commit: sha }
    } catch (error) {
      this.dispatchPending = false
      throw error
    }
  }

  private beginDispatch() {
    if (this.dispatchPending) {
      throw new UpdateError(UPDATE_CODES.UPDATE_IN_PROGRESS, 'Bir güncelleme zaten çalışıyor.', 409)
    }
    this.dispatchPending = true
    this.pendingSince = Date.now()
  }

  private releaseDispatchGuard(runs: Awaited<ReturnType<GithubActionsClient['listWorkflowRuns']>>) {
    if (!this.dispatchPending) return
    if (runs.some(isActiveRun)) {
      this.dispatchPending = false
      return
    }
    const startedAfter = this.pendingSince - 2000
    if (runs.some((item) => Date.parse(item.created_at) >= startedAfter)) {
      this.dispatchPending = false
    }
  }

  private async assertIdle() {
    const runs = await this.github.listWorkflowRuns()
    if (runs.some(isActiveRun)) {
      throw new UpdateError(UPDATE_CODES.UPDATE_IN_PROGRESS, 'Bir güncelleme zaten çalışıyor.', 409)
    }
  }

  private async previousCommit(current: string) {
    const fromHistory = await this.history.latestSuccessful()
    if (fromHistory?.commit_sha && !sameCommit(fromHistory.commit_sha, current)) {
      return fromHistory.commit_sha
    }
    return ''
  }
}

let shared: SystemUpdateService | undefined

export function getSystemUpdateService() {
  shared ||= new SystemUpdateService()
  return shared
}
