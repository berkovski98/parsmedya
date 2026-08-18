import { GITHUB_BRANCH, GITHUB_OWNER, GITHUB_REPO, WORKFLOW_FILE, getGithubDeployToken, hasGithubDeployToken, isCommitSha } from './config'
import { emptyReleaseCandidate, parseReleaseCandidate } from './release'
import { UPDATE_CODES, UpdateError } from './errors'
import {
  DEPLOYMENT_PROGRESS,
  emptyPhaseMeasurement,
  inferPhaseFromSteps,
  isIgnoredJobStep,
  measurePhase,
  type PhaseMeasurement,
} from './progress-steps'

const API = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`
const WORKFLOW_PATH = `.github/workflows/${WORKFLOW_FILE}`

export interface GithubCommit {
  sha: string
  message: string
  date: string
  author: string
}

export interface GithubWorkflowRun {
  id: number
  status: string
  conclusion: string | null
  html_url: string
  created_at: string
  updated_at: string
  head_sha: string
  display_title: string
  run_number: number
  event: string
}

export interface GithubJobStep {
  name: string
  status: string
  conclusion: string | null
}

export type DeployPhase =
  | 'idle'
  | 'queued'
  | 'preparing'
  | 'dependencies'
  | 'tests'
  | 'build'
  | 'deploy'
  | 'restart'
  | 'health'
  | 'success'
  | 'failed'

export interface DeployProgress {
  phase: DeployPhase
  phaseLabel: string
  progress: number
  overallProgress: number
  stepProgress: number
  stepLabel: string
  stepDetail: string
  completedSubsteps: number
  totalSubsteps: number
  substeps: PhaseMeasurement['substeps']
  errorMessage: string | null
}

export interface GithubActionsClient {
  latestMainCommit(): Promise<GithubCommit>
  releaseCandidate(): Promise<{ version: string; releaseTitle: string; summary: string; releaseNotes: string[] }>
  commitExists(sha: string): Promise<boolean>
  listWorkflowRuns(): Promise<GithubWorkflowRun[]>
  getWorkflowRun(runId: number): Promise<GithubWorkflowRun | null>
  listJobSteps(runId: number): Promise<GithubJobStep[]>
  dispatch(deploySha?: string): Promise<void>
}

const COMMIT_CACHE_MS = 45_000
const RUNS_CACHE_MS = 10_000

type CacheEntry<T> = { expires: number; value: T }
let commitCache: CacheEntry<GithubCommit> | null = null
let runsCache: CacheEntry<GithubWorkflowRun[]> | null = null

export function resetGithubCache() {
  commitCache = null
  runsCache = null
}

export function githubApiHeaders() {
  const token = getGithubDeployToken()
  const result: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'parsmedya-system-update',
  }
  if (token) result.Authorization = `Bearer ${token}`
  return result
}

async function githubFetch(url: string, init: RequestInit = {}) {
  const response = await fetch(url, {
    ...init,
    headers: { ...githubApiHeaders(), ...(init.headers as Record<string, string> | undefined) },
    cache: 'no-store',
  })
  return response
}

async function readJson<T>(response: Response): Promise<T> {
  return await response.json() as T
}

function failUnavailable() {
  return new UpdateError(UPDATE_CODES.GITHUB_UNAVAILABLE, 'GitHub bilgisi alınamadı.', 502)
}

function failNotConfigured() {
  return new UpdateError(
    UPDATE_CODES.GITHUB_DEPLOY_NOT_CONFIGURED,
    'Otomatik kurulum için GitHub deploy bağlantısı yapılandırılmamış.',
    503,
  )
}

function throwIfReadFailed(response: Response) {
  if (response.ok) return
  throw failUnavailable()
}

export const githubActions: GithubActionsClient = {
  async latestMainCommit() {
    if (commitCache && commitCache.expires > Date.now()) return commitCache.value
    const response = await githubFetch(`${API}/commits/${encodeURIComponent(GITHUB_BRANCH)}`)
    throwIfReadFailed(response)
    const payload = await readJson<{
      sha: string
      commit?: { message?: string; author?: { name?: string; date?: string } }
    }>(response)
    const value: GithubCommit = {
      sha: payload.sha,
      message: (payload.commit?.message || '').split('\n')[0] || '',
      date: payload.commit?.author?.date || '',
      author: payload.commit?.author?.name || '',
    }
    commitCache = { expires: Date.now() + COMMIT_CACHE_MS, value }
    return value
  },

  async releaseCandidate() {
    try {
      const response = await githubFetch(`${API}/contents/release-candidate.json?ref=${encodeURIComponent(GITHUB_BRANCH)}`)
      if (!response.ok) return emptyReleaseCandidate()
      const payload = await readJson<{ content?: string }>(response)
      const raw = Buffer.from((payload.content || '').replace(/\s/g, ''), 'base64').toString('utf8')
      return parseReleaseCandidate(JSON.parse(raw))
    } catch {
      return emptyReleaseCandidate()
    }
  },

  async commitExists(sha: string) {
    if (!isCommitSha(sha)) return false
    const response = await githubFetch(`${API}/commits/${encodeURIComponent(sha.toLowerCase())}`)
    return response.ok
  },

  async listWorkflowRuns() {
    try {
      if (runsCache && runsCache.expires > Date.now()) return runsCache.value
      const response = await githubFetch(
        `${API}/actions/workflows/${encodeURIComponent(WORKFLOW_FILE)}/runs?per_page=10&branch=${GITHUB_BRANCH}`,
      )
      if (!response.ok) return []
      const payload = await readJson<{ workflow_runs?: GithubWorkflowRun[] }>(response)
      const value = payload.workflow_runs || []
      runsCache = { expires: Date.now() + RUNS_CACHE_MS, value }
      return value
    } catch {
      return []
    }
  },

  async getWorkflowRun(runId: number) {
    try {
      const response = await githubFetch(`${API}/actions/runs/${runId}`)
      if (!response.ok) return null
      return await readJson<GithubWorkflowRun>(response)
    } catch {
      return null
    }
  },

  async listJobSteps(runId: number) {
    try {
      const response = await githubFetch(`${API}/actions/runs/${runId}/jobs?per_page=20`)
      if (!response.ok) return []
      const payload = await readJson<{ jobs?: { steps?: GithubJobStep[] }[] }>(response)
      return (payload.jobs || []).flatMap((job) => job.steps || [])
    } catch {
      return []
    }
  },

  async dispatch(deploySha?: string) {
    if (!hasGithubDeployToken()) throw failNotConfigured()
    const body: { ref: string; inputs?: { deploy_sha: string } } = { ref: GITHUB_BRANCH }
    if (deploySha) {
      if (!isCommitSha(deploySha)) {
        throw new UpdateError(UPDATE_CODES.INVALID_SHA, 'Geçersiz commit SHA.', 400)
      }
      body.inputs = { deploy_sha: deploySha.toLowerCase() }
    }
    const response = await githubFetch(`${API}/actions/workflows/${encodeURIComponent(WORKFLOW_FILE)}/dispatches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (response.status === 204 || response.ok) return
    if (response.status === 401 || response.status === 403) throw failNotConfigured()
    if (response.status === 404) {
      throw new UpdateError(UPDATE_CODES.UPDATE_FAILED, 'Production Deploy workflow bulunamadı.', 502)
    }
    throw failUnavailable()
  },
}

export function isActiveRun(run: GithubWorkflowRun) {
  return run.status === 'queued' || run.status === 'in_progress' || run.status === 'waiting' || run.status === 'requested' || run.status === 'pending'
}

export function mapWorkflowState(run: GithubWorkflowRun | null): {
  status: 'queued' | 'in_progress' | 'completed'
  conclusion: 'success' | 'failure' | 'cancelled' | null
} {
  if (!run) return { status: 'completed', conclusion: null }
  if (run.status === 'queued' || run.status === 'waiting' || run.status === 'requested' || run.status === 'pending') {
    return { status: 'queued', conclusion: null }
  }
  if (run.status === 'in_progress') return { status: 'in_progress', conclusion: null }
  if (run.conclusion === 'success') return { status: 'completed', conclusion: 'success' }
  if (run.conclusion === 'cancelled') return { status: 'completed', conclusion: 'cancelled' }
  return { status: 'completed', conclusion: 'failure' }
}

export function mapRunStatus(run: GithubWorkflowRun | null) {
  return mapWorkflowState(run).status
}

function publicStepError(stepName?: string) {
  if (!stepName) return 'Kurulum adımı başarısız oldu.'
  const safe = stepName.replace(/https?:\/\/\S+/g, '').trim().slice(0, 80)
  if (/token|secret|password|private key|ghp_|github_pat_|BEGIN /i.test(safe)) {
    return 'Kurulum adımı başarısız oldu.'
  }
  return `Adım başarısız: ${safe}`
}

function currentStep(steps: GithubJobStep[]) {
  const relevant = steps.filter((step) => !isIgnoredJobStep(step.name))
  return [...relevant].reverse().find((step) => step.status === 'in_progress')
    || relevant.find((step) => step.status === 'queued' && step.conclusion == null)
    || [...relevant].reverse().find((step) => step.conclusion === 'failure' || step.conclusion === 'cancelled')
    || null
}

function withMeasurement(
  phase: DeployPhase,
  measurement: PhaseMeasurement,
  extras: { phaseLabel?: string; errorMessage?: string | null } = {},
): DeployProgress {
  const overallProgress = measurement.overallProgress
  return {
    phase,
    phaseLabel: extras.phaseLabel !== undefined ? extras.phaseLabel : measurement.stepLabel,
    progress: overallProgress,
    overallProgress,
    stepProgress: measurement.stepProgress,
    stepLabel: measurement.stepLabel,
    stepDetail: measurement.stepDetail,
    completedSubsteps: measurement.completedSubsteps,
    totalSubsteps: measurement.totalSubsteps,
    substeps: measurement.substeps,
    errorMessage: extras.errorMessage ?? null,
  }
}

export function mapDeployProgress(run: GithubWorkflowRun | null, steps: GithubJobStep[] = []): DeployProgress {
  if (!run) {
    return withMeasurement('idle', emptyPhaseMeasurement('queued'), { phaseLabel: '', errorMessage: null })
  }
  const state = mapWorkflowState(run)
  if (state.status === 'queued') {
    return withMeasurement('queued', emptyPhaseMeasurement('queued'), { phaseLabel: 'İşlem sıraya alındı' })
  }
  if (state.status === 'completed' && state.conclusion === 'success') {
    return withMeasurement('success', {
      ...emptyPhaseMeasurement('completed'),
      stepProgress: 100,
    }, { phaseLabel: 'Güncelleme başarıyla tamamlandı' })
  }

  const phaseKey = inferPhaseFromSteps(steps)
  const measurement = measurePhase(phaseKey, steps)
  const step = currentStep(steps)
  if (state.status === 'completed') {
    return withMeasurement('failed', {
      ...measurement,
      overallProgress: Math.min(measurement.overallProgress, DEPLOYMENT_PROGRESS.health),
    }, {
      phaseLabel: measurement.stepLabel,
      errorMessage: publicStepError(step?.name),
    })
  }
  if (!step) {
    return withMeasurement('preparing', measurePhase('preparing', steps), { phaseLabel: 'Hazırlanıyor' })
  }
  const uiPhase: DeployPhase = phaseKey === 'queued' || phaseKey === 'completed' ? 'preparing' : phaseKey
  return withMeasurement(uiPhase, measurement)
}

export function mapDeployPhase(run: GithubWorkflowRun | null, steps: GithubJobStep[] = []): DeployPhase {
  return mapDeployProgress(run, steps).phase
}

export function workflowFilePath() {
  return WORKFLOW_PATH
}
