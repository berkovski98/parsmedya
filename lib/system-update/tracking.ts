import { isActiveRun, mapDeployProgress, mapWorkflowState, type DeployPhase, type GithubWorkflowRun } from './github'

export interface DeploymentTrack {
  previousRunId: number
  requestedAt: string
  targetCommit: string
  trackedRunId: number | null
}

export interface StatusQuery {
  runId?: number | null
  previousRunId?: number | null
  requestedAt?: string | null
  targetCommit?: string | null
}

export interface SelectedDeployment {
  run: GithubWorkflowRun | null
  waitingForRun: boolean
  isTrackedDeployment: boolean
}

const REQUESTED_AT_SLACK_MS = 15_000

export function mergeStatusQuery(track: DeploymentTrack | null, query: StatusQuery = {}): StatusQuery {
  return {
    runId: query.runId || track?.trackedRunId || null,
    previousRunId: query.previousRunId ?? track?.previousRunId ?? null,
    requestedAt: query.requestedAt || track?.requestedAt || null,
    targetCommit: query.targetCommit || track?.targetCommit || null,
  }
}

export function hasTracking(query: StatusQuery) {
  return Boolean(query.runId || (query.previousRunId != null && query.previousRunId >= 0 && query.requestedAt))
}

function sameSha(left?: string | null, right?: string | null) {
  if (!left || !right) return false
  return left.trim().toLowerCase() === right.trim().toLowerCase()
}

export function isNewRunCandidate(run: GithubWorkflowRun, query: StatusQuery) {
  if (query.runId) return run.id === query.runId
  if (query.previousRunId != null && run.id <= query.previousRunId) return false
  if (query.requestedAt) {
    const created = Date.parse(run.created_at)
    const requested = Date.parse(query.requestedAt)
    if (!Number.isNaN(created) && !Number.isNaN(requested) && created < requested - REQUESTED_AT_SLACK_MS) {
      return false
    }
  }
  return true
}

export function findTrackedWorkflowRun(runs: GithubWorkflowRun[], query: StatusQuery): GithubWorkflowRun | null {
  if (query.runId) {
    return runs.find((run) => run.id === query.runId) || null
  }
  const candidates = runs.filter((run) => isNewRunCandidate(run, query))
  if (candidates.length === 0) return null
  if (query.targetCommit) {
    const matched = candidates.find((run) => sameSha(run.head_sha, query.targetCommit))
    if (matched) return matched
  }
  return [...candidates].sort((left, right) => right.id - left.id)[0] || null
}

export function selectDeploymentRun(runs: GithubWorkflowRun[], query: StatusQuery = {}): SelectedDeployment {
  if (query.runId) {
    const pinned = runs.find((run) => run.id === query.runId) || null
    return { run: pinned, waitingForRun: !pinned, isTrackedDeployment: true }
  }

  if (hasTracking(query)) {
    const found = findTrackedWorkflowRun(runs, query)
    if (found) return { run: found, waitingForRun: false, isTrackedDeployment: true }
    return { run: null, waitingForRun: true, isTrackedDeployment: true }
  }

  const active = runs.find(isActiveRun) || null
  return { run: active, waitingForRun: false, isTrackedDeployment: Boolean(active) }
}

export function waitingDispatchStatus() {
  return {
    status: 'queued' as const,
    conclusion: null,
    phase: 'queued' as DeployPhase,
    phaseLabel: 'GitHub Actions başlatılıyor',
    progress: 0,
    overallProgress: 0,
    stepProgress: 0,
    stepLabel: 'Sıraya alındı',
    stepDetail: '',
    completedSubsteps: 0,
    totalSubsteps: 0,
    substeps: [] as { label: string; state: 'complete' | 'active' | 'pending' | 'failed' }[],
    runId: null as number | null,
    isTrackedDeployment: true,
  }
}

export function trackedRunStatus(run: GithubWorkflowRun, steps: Parameters<typeof mapDeployProgress>[1] = []) {
  const state = mapWorkflowState(run)
  const progress = mapDeployProgress(run, steps)
  const isSuccess = state.status === 'completed' && state.conclusion === 'success' && Boolean(run.id)
  return {
    status: state.status,
    conclusion: state.conclusion,
    phase: isSuccess ? 'success' as const : progress.phase,
    phaseLabel: isSuccess ? 'Güncelleme başarıyla tamamlandı' : progress.phaseLabel,
    progress: isSuccess ? 100 : progress.progress,
    overallProgress: isSuccess ? 100 : progress.overallProgress,
    stepProgress: isSuccess ? 100 : progress.stepProgress,
    stepLabel: isSuccess ? 'Tamamlandı' : progress.stepLabel,
    stepDetail: isSuccess ? '' : progress.stepDetail,
    completedSubsteps: isSuccess ? progress.totalSubsteps : progress.completedSubsteps,
    totalSubsteps: progress.totalSubsteps,
    substeps: isSuccess ? [] : progress.substeps,
    runId: run.id,
    isTrackedDeployment: true,
    errorMessage: progress.errorMessage,
  }
}

export function isTerminalRun(run: GithubWorkflowRun | null) {
  if (!run) return false
  return mapWorkflowState(run).status === 'completed'
}

export function blocksSecondInstall(track: DeploymentTrack | null, runs: GithubWorkflowRun[]) {
  if (runs.some(isActiveRun)) return true
  if (!track) return false
  if (!track.trackedRunId) return true
  const run = runs.find((item) => item.id === track.trackedRunId) || null
  if (!run) return true
  return !isTerminalRun(run)
}

export function deploymentPanelState(input: {
  installing: boolean
  isTrackedDeployment: boolean
  runId: number | null
  status: 'queued' | 'in_progress' | 'completed'
  conclusion: 'success' | 'failure' | 'cancelled' | null
  progress: number
  phaseLabel: string
  persistedOutcome: 'success' | 'failure' | 'cancelled' | null
}) {
  const waitingForGithub = input.installing && !input.runId
  const trackedActive = input.isTrackedDeployment && (input.status === 'queued' || input.status === 'in_progress')
  const trackedTerminal = input.isTrackedDeployment && input.status === 'completed' && Boolean(input.runId)
  const outcome = trackedTerminal
    ? (input.conclusion === 'success' ? 'success' : input.conclusion === 'cancelled' ? 'cancelled' : 'failure')
    : input.persistedOutcome

  const show = Boolean(input.installing || trackedActive || waitingForGithub || outcome)
  const progress = outcome === 'success'
    ? 100
    : waitingForGithub && !input.runId
      ? 0
      : input.progress
  const phaseLabel = !input.runId && (input.installing || input.isTrackedDeployment)
    ? (input.phaseLabel || 'GitHub Actions başlatılıyor')
    : outcome === 'success'
      ? 'Güncelleme başarıyla tamamlandı'
      : input.phaseLabel
  const installDisabled = Boolean(input.installing || trackedActive || (waitingForGithub && !outcome))

  return {
    show,
    progress,
    phaseLabel,
    outcome,
    installDisabled,
    waitingForGithub: Boolean(waitingForGithub && !outcome),
  }
}
