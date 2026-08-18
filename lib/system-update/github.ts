import { GITHUB_BRANCH, GITHUB_OWNER, GITHUB_REPO, WORKFLOW_FILE, getGithubDeployToken, isCommitSha } from './config'
import { UPDATE_CODES, UpdateError } from './errors'

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
  | 'preparing'
  | 'build'
  | 'deploy'
  | 'restart'
  | 'health'
  | 'success'
  | 'failed'

export interface GithubActionsClient {
  latestMainCommit(): Promise<GithubCommit>
  commitExists(sha: string): Promise<boolean>
  listWorkflowRuns(): Promise<GithubWorkflowRun[]>
  listJobSteps(runId: number): Promise<GithubJobStep[]>
  dispatch(deploySha?: string): Promise<void>
}

function headers() {
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
    headers: { ...headers(), ...(init.headers as Record<string, string> | undefined) },
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

export const githubActions: GithubActionsClient = {
  async latestMainCommit() {
    const response = await githubFetch(`${API}/commits/${encodeURIComponent(GITHUB_BRANCH)}`)
    if (!response.ok) throw failUnavailable()
    const payload = await readJson<{
      sha: string
      commit?: { message?: string; author?: { name?: string; date?: string } }
    }>(response)
    return {
      sha: payload.sha,
      message: (payload.commit?.message || '').split('\n')[0] || '',
      date: payload.commit?.author?.date || '',
      author: payload.commit?.author?.name || '',
    }
  },

  async commitExists(sha: string) {
    if (!isCommitSha(sha)) return false
    const response = await githubFetch(`${API}/commits/${encodeURIComponent(sha.toLowerCase())}`)
    return response.ok
  },

  async listWorkflowRuns() {
    const response = await githubFetch(
      `${API}/actions/workflows/${encodeURIComponent(WORKFLOW_FILE)}/runs?per_page=10&branch=${GITHUB_BRANCH}`,
    )
    if (response.status === 404) return []
    if (!response.ok) throw failUnavailable()
    const payload = await readJson<{ workflow_runs?: GithubWorkflowRun[] }>(response)
    return payload.workflow_runs || []
  },

  async listJobSteps(runId: number) {
    const response = await githubFetch(`${API}/actions/runs/${runId}/jobs?per_page=20`)
    if (!response.ok) return []
    const payload = await readJson<{ jobs?: { steps?: GithubJobStep[] }[] }>(response)
    return (payload.jobs || []).flatMap((job) => job.steps || [])
  },

  async dispatch(deploySha?: string) {
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

export function mapDeployPhase(run: GithubWorkflowRun | null, steps: GithubJobStep[] = []): DeployPhase {
  if (!run) return 'idle'
  const state = mapWorkflowState(run)
  if (state.status === 'completed' && state.conclusion === 'success') return 'success'
  if (state.status === 'completed') return 'failed'
  if (state.status === 'queued') return 'preparing'

  const current = [...steps].reverse().find((step) => step.status === 'in_progress')
    || steps.find((step) => step.status === 'queued' && step.conclusion == null)
  const name = (current?.name || '').toLowerCase()
  if (/health|curl|doğrula|verify/.test(name)) return 'health'
  if (/restart|passenger/.test(name)) return 'restart'
  if (/sftp|deploy|rsync|upload|promote/.test(name)) return 'deploy'
  if (/build|test|install|pnpm|standalone|version/.test(name)) return 'build'
  return 'preparing'
}

export function workflowFilePath() {
  return WORKFLOW_PATH
}
