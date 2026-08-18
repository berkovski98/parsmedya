import { GITHUB_READ_AVAILABLE, hasGithubDeployToken, isCommitSha, sameCommit } from './config'
import { UPDATE_CODES, UpdateError } from './errors'
import { isExplicitConfirmation } from './intent'
import {
  githubActions,
  type GithubActionsClient,
} from './github'
import { supabaseHistory, type HistoryStore } from './history'
import {
  blocksSecondInstall,
  mergeStatusQuery,
  selectDeploymentRun,
  trackedRunStatus,
  waitingDispatchStatus,
  type DeploymentTrack,
  type StatusQuery,
} from './tracking'
import { emptyReleaseCandidate, isUpdateAvailable } from './release'
import { readVersionFile, type VersionInfo } from './version-file'

export interface SystemUpdateDeps {
  github?: GithubActionsClient
  history?: HistoryStore
  readVersion?: () => Promise<VersionInfo>
  appRoot?: string
  isConfigured?: () => boolean
}

export class SystemUpdateService {
  private readonly github: GithubActionsClient
  private readonly history: HistoryStore
  private readonly readVersion: () => Promise<VersionInfo>
  private readonly isConfigured: () => boolean
  private track: DeploymentTrack | null = null

  constructor(deps: SystemUpdateDeps = {}) {
    this.github = deps.github || githubActions
    this.history = deps.history || supabaseHistory
    this.readVersion = deps.readVersion || (() => readVersionFile(deps.appRoot || process.cwd()))
    this.isConfigured = deps.isConfigured || hasGithubDeployToken
  }

  async check() {
    const current = await this.readVersion()
    const capabilities = this.capabilities()
    try {
      const latest = await this.github.latestMainCommit()
      const candidate = await this.github.releaseCandidate()
      const candidateVersion = candidate.version || current.version
      return {
        currentCommit: current.commit,
        latestCommit: latest.sha,
        updateAvailable: isUpdateAvailable(
          { version: current.version, commit: current.commit },
          { version: candidateVersion, commit: latest.sha },
        ),
        latestMessage: latest.message,
        latestDate: latest.date,
        latestAuthor: latest.author,
        currentVersion: current.version,
        currentBuild: current.build,
        latestVersion: candidateVersion,
        candidateVersion,
        candidateTitle: candidate.releaseTitle || '',
        releaseTitle: candidate.releaseTitle || '',
        releaseSummary: candidate.summary || '',
        releaseNotes: candidate.releaseNotes || [],
        releasedAt: latest.date,
        installedTitle: current.releaseTitle || '',
        installedNotes: current.releaseNotes || [],
        installedReleasedAt: current.releasedAt || current.createdAt,
        githubError: null as string | null,
        ...capabilities,
      }
    } catch (error) {
      if (error instanceof UpdateError && error.code === UPDATE_CODES.GITHUB_UNAVAILABLE) {
        return {
          currentCommit: current.commit,
          latestCommit: '',
          updateAvailable: false,
          latestMessage: '',
          latestDate: '',
          latestAuthor: '',
          currentVersion: current.version,
          currentBuild: current.build,
          latestVersion: '',
          candidateVersion: '',
          candidateTitle: '',
          releaseTitle: '',
          releaseSummary: '',
          releaseNotes: [] as string[],
          releasedAt: '',
          installedTitle: current.releaseTitle || '',
          installedNotes: current.releaseNotes || [],
          installedReleasedAt: current.releasedAt || current.createdAt,
          githubError: error.message,
          ...capabilities,
        }
      }
      throw error
    }
  }

  async status(query: StatusQuery = {}) {
    const current = await this.readVersion()
    const previous = await this.previousCommit(current.commit)
    const idle = {
      status: 'completed' as const,
      conclusion: null as 'success' | 'failure' | 'cancelled' | null,
      phase: 'idle' as const,
      phaseLabel: '',
      progress: 0,
      overallProgress: 0,
      stepProgress: 0,
      stepLabel: '',
      stepDetail: '',
      completedSubsteps: 0,
      totalSubsteps: 0,
      substeps: [] as { label: string; state: 'complete' | 'active' | 'pending' | 'failed' }[],
      runId: null as number | null,
      commit: current.commit,
      startedAt: null as string | null,
      updatedAt: null as string | null,
      completedAt: null as string | null,
      url: null as string | null,
      version: current.version,
      build: current.build,
      currentCommit: current.commit,
      previousCommit: previous,
      nodeVersion: process.versions.node,
      errorMessage: null as string | null,
      ...this.capabilities(),
      isTrackedDeployment: false,
      previousRunId: query.previousRunId ?? this.track?.previousRunId ?? null,
      requestedAt: query.requestedAt || this.track?.requestedAt || null,
      targetCommit: query.targetCommit || this.track?.targetCommit || null,
      installingVersion: null as string | null,
      installingCommit: null as string | null,
      installingTitle: null as string | null,
      installingNotes: [] as string[],
      releaseTitle: current.releaseTitle || '',
      releaseNotes: current.releaseNotes || [],
      lastSuccessfulDeployment: {
        version: current.version,
        build: current.build,
        commit: current.commit,
        runId: null as number | null,
        deployedAt: current.releasedAt || current.createdAt || null,
      },
    }
    try {
      const runs = await this.github.listWorkflowRuns()
      const candidate = await this.github.releaseCandidate().catch(() => emptyReleaseCandidate())
      const candidateVersion = candidate.version || ''
      const successful = [...runs]
        .filter((item) => item.conclusion === 'success' && sameCommit(item.head_sha, current.commit))
        .sort((left, right) => right.id - left.id)[0] || null
      idle.lastSuccessfulDeployment.runId = successful?.id ?? null
      if (!idle.lastSuccessfulDeployment.deployedAt && successful?.updated_at) {
        idle.lastSuccessfulDeployment.deployedAt = successful.updated_at
      }

      const merged = mergeStatusQuery(this.track, query)
      let selected = selectDeploymentRun(runs, merged)
      if (merged.runId && !selected.run) {
        const pinned = await this.github.getWorkflowRun(merged.runId)
        if (pinned) selected = { run: pinned, waitingForRun: false, isTrackedDeployment: true }
      }
      this.syncTrack(selected.run, merged)
      const installingCommit = merged.targetCommit || selected.run?.head_sha || null

      if (selected.waitingForRun) {
        const waiting = waitingDispatchStatus()
        return {
          ...idle,
          ...waiting,
          commit: current.commit,
          version: current.version,
          build: current.build,
          currentCommit: current.commit,
          installingVersion: candidateVersion || null,
          installingCommit,
          installingTitle: candidate.releaseTitle || null,
          installingNotes: candidate.releaseNotes || [],
          previousRunId: merged.previousRunId ?? null,
          requestedAt: merged.requestedAt || null,
          targetCommit: merged.targetCommit || null,
        }
      }

      if (!selected.run) {
        const history = await this.history.latestSuccessful()
        return {
          ...idle,
          completedAt: current.releasedAt || current.createdAt || history?.completed_at || successful?.updated_at || null,
        }
      }

      const steps = await this.github.listJobSteps(selected.run.id)
      const tracked = trackedRunStatus(selected.run, steps)
      const history = await this.history.latestSuccessful()
      const trackedActive = tracked.status === 'queued' || tracked.status === 'in_progress'
      const trackedFailed = tracked.status === 'completed' && tracked.conclusion !== 'success'
      return {
        ...idle,
        status: tracked.status,
        conclusion: tracked.conclusion,
        phase: tracked.phase,
        phaseLabel: tracked.phaseLabel,
        progress: tracked.progress,
        overallProgress: tracked.overallProgress,
        stepProgress: tracked.stepProgress,
        stepLabel: tracked.stepLabel,
        stepDetail: tracked.stepDetail,
        completedSubsteps: tracked.completedSubsteps,
        totalSubsteps: tracked.totalSubsteps,
        substeps: tracked.substeps,
        runId: tracked.runId,
        commit: current.commit,
        version: current.version,
        build: current.build,
        currentCommit: current.commit,
        startedAt: selected.run.created_at,
        updatedAt: selected.run.updated_at,
        completedAt: current.releasedAt || current.createdAt || history?.completed_at || successful?.updated_at || null,
        url: selected.run.html_url,
        errorMessage: tracked.errorMessage,
        isTrackedDeployment: selected.isTrackedDeployment,
        previousRunId: merged.previousRunId ?? this.track?.previousRunId ?? null,
        requestedAt: merged.requestedAt || this.track?.requestedAt || null,
        targetCommit: merged.targetCommit || this.track?.targetCommit || selected.run.head_sha,
        installingVersion: selected.isTrackedDeployment && (trackedActive || trackedFailed) ? (candidateVersion || null) : null,
        installingCommit: selected.isTrackedDeployment && (trackedActive || trackedFailed) ? installingCommit : null,
        installingTitle: selected.isTrackedDeployment ? (candidate.releaseTitle || null) : null,
        installingNotes: selected.isTrackedDeployment ? (candidate.releaseNotes || []) : [],
      }
    } catch {
      if (mergeStatusQuery(this.track, query).requestedAt || mergeStatusQuery(this.track, query).previousRunId != null) {
        return {
          ...idle,
          ...waitingDispatchStatus(),
          commit: current.commit,
          version: current.version,
          build: current.build,
          currentCommit: current.commit,
        }
      }
      return idle
    }
  }

  async install(adminUserId?: string, confirmed = false) {
    if (!isExplicitConfirmation(confirmed)) {
      throw new UpdateError(UPDATE_CODES.CONFIRMATION_REQUIRED, 'Kurulum için açık onay gerekli.', 400)
    }
    this.assertDeployConfigured()
    const runs = await this.github.listWorkflowRuns()
    if (blocksSecondInstall(this.track, runs)) {
      throw new UpdateError(UPDATE_CODES.UPDATE_IN_PROGRESS, 'Bir güncelleme zaten çalışıyor.', 409)
    }
    const check = await this.check()
    if (!check.updateAvailable) {
      throw new UpdateError(UPDATE_CODES.NO_UPDATE, 'Yeni bir güncelleme yok.', 409)
    }
    const previousRunId = runs.reduce((max, run) => Math.max(max, run.id), 0)
    const requestedAt = new Date().toISOString()
    await this.github.dispatch()
    this.track = {
      previousRunId,
      requestedAt,
      targetCommit: check.latestCommit,
      trackedRunId: null,
    }
    await this.history.start({
      version: check.currentVersion,
      build: '',
      commit_sha: check.latestCommit,
      status: 'queued',
      admin_user_id: adminUserId,
    })
    return {
      status: 'queued' as const,
      commit: check.latestCommit,
      previousRunId,
      requestedAt,
      targetCommit: check.latestCommit,
      runId: null as number | null,
      phase: 'queued' as const,
      phaseLabel: 'Kurulum başlatılıyor',
      progress: 0,
      overallProgress: 0,
      stepProgress: 0,
      stepLabel: 'Sıraya alındı',
      stepDetail: '',
    }
  }

  async rollback(commitSha: string, adminUserId?: string, confirmed = false) {
    if (!isExplicitConfirmation(confirmed)) {
      throw new UpdateError(UPDATE_CODES.CONFIRMATION_REQUIRED, 'Geri alma için açık onay gerekli.', 400)
    }
    const sha = commitSha.trim().toLowerCase()
    if (!isCommitSha(sha)) {
      throw new UpdateError(UPDATE_CODES.INVALID_SHA, 'Geçersiz commit SHA.', 400)
    }
    this.assertDeployConfigured()
    const runs = await this.github.listWorkflowRuns()
    if (blocksSecondInstall(this.track, runs)) {
      throw new UpdateError(UPDATE_CODES.UPDATE_IN_PROGRESS, 'Bir güncelleme zaten çalışıyor.', 409)
    }
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
    const previousRunId = runs.reduce((max, run) => Math.max(max, run.id), 0)
    const requestedAt = new Date().toISOString()
    await this.github.dispatch(sha)
    this.track = {
      previousRunId,
      requestedAt,
      targetCommit: sha,
      trackedRunId: null,
    }
    await this.history.start({
      version: current.version,
      build: '',
      commit_sha: sha,
      status: 'queued',
      admin_user_id: adminUserId,
    })
    return {
      status: 'queued' as const,
      commit: sha,
      previousRunId,
      requestedAt,
      targetCommit: sha,
      runId: null as number | null,
      phase: 'queued' as const,
      phaseLabel: 'Kurulum başlatılıyor',
      progress: 0,
      overallProgress: 0,
      stepProgress: 0,
      stepLabel: 'Sıraya alındı',
      stepDetail: '',
    }
  }

  private syncTrack(run: import('./github').GithubWorkflowRun | null, query: StatusQuery) {
    if (!this.track && (query.previousRunId != null || query.requestedAt || query.runId)) {
      this.track = {
        previousRunId: query.previousRunId ?? 0,
        requestedAt: query.requestedAt || new Date().toISOString(),
        targetCommit: query.targetCommit || '',
        trackedRunId: query.runId || run?.id || null,
      }
    }
    if (this.track && run) this.track.trackedRunId = run.id
  }

  private capabilities() {
    const githubDeployConfigured = this.isConfigured()
    return {
      githubReadAvailable: GITHUB_READ_AVAILABLE,
      githubDeployConfigured,
      githubConfigured: githubDeployConfigured,
    }
  }

  private assertDeployConfigured() {
    if (!this.isConfigured()) {
      throw new UpdateError(
        UPDATE_CODES.GITHUB_DEPLOY_NOT_CONFIGURED,
        'Otomatik kurulum için GitHub deploy bağlantısı yapılandırılmamış.',
        503,
      )
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
