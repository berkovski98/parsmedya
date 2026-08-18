import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { requireAdminApi } from '../lib/system-update/auth'
import { UPDATE_CODES, UpdateError } from '../lib/system-update/errors'
import { githubActions, isActiveRun, mapDeployPhase, mapDeployProgress, mapRunStatus, mapWorkflowState, type GithubActionsClient, type GithubWorkflowRun } from '../lib/system-update/github'
import { hasGithubDeployToken } from '../lib/system-update/config'
import { SystemUpdateService } from '../lib/system-update/service'
import { countDispatches } from '../lib/system-update/intent'
import { deploymentPanelState } from '../lib/system-update/tracking'
import type { HistoryStore } from '../lib/system-update/history'
import type { VersionInfo } from '../lib/system-update/version-file'

const CURRENT = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
const LATEST = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
const PREVIOUS = 'cccccccccccccccccccccccccccccccccccccccc'

function run(partial: Partial<GithubWorkflowRun>): GithubWorkflowRun {
  return {
    id: 11,
    status: 'completed',
    conclusion: 'success',
    html_url: 'https://github.com/berkovski98/parsmedya/actions/runs/11',
    created_at: '2026-08-18T12:00:00Z',
    updated_at: '2026-08-18T12:10:00Z',
    head_sha: LATEST,
    display_title: 'Production Deploy',
    run_number: 4,
    event: 'workflow_dispatch',
    ...partial,
  }
}

function memoryHistory(successful: string[] = [PREVIOUS]): HistoryStore {
  const rows: { id: string; status: string; commit_sha: string; completed_at: string | null }[] = successful.map((sha, index) => ({
    id: `success-${index + 1}`,
    status: 'success',
    commit_sha: sha,
    completed_at: '2026-08-18T11:00:00.000Z',
  }))
  return {
    async start(record) {
      const id = String(rows.length + 1)
      rows.push({ id, status: record.status, commit_sha: record.commit_sha, completed_at: null })
      return id
    },
    async finish(id, patch) {
      const row = rows.find((item) => item.id === id)
      if (row) {
        row.status = patch.status || row.status
        row.completed_at = new Date().toISOString()
      }
    },
    async latest() {
      const row = rows.at(-1)
      return row ? { completed_at: row.completed_at, status: row.status, commit_sha: row.commit_sha } : null
    },
    async latestSuccessful() {
      const row = [...rows].reverse().find((item) => item.status === 'success')
      return row ? { commit_sha: row.commit_sha } : null
    },
    async hasSuccessfulCommit(sha) {
      return rows.some((item) => item.status === 'success' && item.commit_sha.toLowerCase() === sha.toLowerCase())
    },
  }
}

function clientFor(options: {
  latest?: string
  runs?: GithubWorkflowRun[] | (() => GithubWorkflowRun[])
  existing?: string[]
  onDispatch?: (sha?: string) => void
  steps?: { name: string; status: string; conclusion: string | null }[] | (() => { name: string; status: string; conclusion: string | null }[])
} = {}): GithubActionsClient {
  const existing = new Set((options.existing || [CURRENT, LATEST, PREVIOUS]).map((sha) => sha.toLowerCase()))
  const listRuns = () => (typeof options.runs === 'function' ? options.runs() : (options.runs || []))
  return {
    async latestMainCommit() {
      const sha = options.latest || LATEST
      return { sha, message: 'feat: production deploy', date: '2026-08-18T12:00:00Z', author: 'Berk' }
    },
    async commitExists(sha) {
      return existing.has(sha.toLowerCase())
    },
    async listWorkflowRuns() {
      return listRuns()
    },
    async getWorkflowRun(runId) {
      return listRuns().find((item) => item.id === runId) || null
    },
    async listJobSteps() {
      return typeof options.steps === 'function' ? options.steps() : (options.steps || [])
    },
    async dispatch(sha) {
      options.onDispatch?.(sha)
    },
  }
}

function serviceFor(github: GithubActionsClient, commit = CURRENT, configured = true) {
  const version: VersionInfo = {
    version: '1.1.0',
    build: '12',
    commit,
    createdAt: '2026-08-18T00:00:00.000Z',
  }
  return new SystemUpdateService({
    github,
    history: memoryHistory(),
    readVersion: async () => version,
    isConfigured: () => configured,
  })
}

test('unauthorized check', async () => {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  await assert.rejects(() => requireAdminApi(), (error: unknown) => (
    error instanceof UpdateError && error.status === 401 && error.code === UPDATE_CODES.UNAUTHORIZED
  ))
})

test('unauthorized install', async () => {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  await assert.rejects(() => requireAdminApi(), (error: unknown) => (
    error instanceof UpdateError && error.status === 401
  ))
})

test('token missing page loads', async () => {
  let dispatched = 0
  const service = serviceFor({
    ...clientFor({
      latest: LATEST,
      onDispatch: () => { dispatched += 1 },
    }),
    async latestMainCommit() {
      throw new UpdateError(UPDATE_CODES.GITHUB_UNAVAILABLE, 'GitHub bilgisi alınamadı.', 502)
    },
  }, CURRENT, false)
  const status = await service.status()
  const check = await service.check()
  assert.equal(status.version, '1.1.0')
  assert.equal(status.build, '12')
  assert.equal(status.currentCommit, CURRENT)
  assert.equal(status.githubConfigured, false)
  assert.equal(check.githubConfigured, false)
  assert.equal(check.updateAvailable, false)
  assert.equal(dispatched, 0)
})

test('install disabled when token missing', async () => {
  const check = await serviceFor(clientFor({ latest: LATEST }), CURRENT, false).check()
  assert.equal(check.updateAvailable, true)
  assert.equal(check.githubConfigured, false)
})

test('install API token missing -> controlled error', async () => {
  let dispatched = 0
  const service = serviceFor(clientFor({
    latest: LATEST,
    onDispatch: () => { dispatched += 1 },
  }), CURRENT, false)
  await assert.rejects(() => service.install('admin', true), (error: unknown) => (
    error instanceof UpdateError
    && error.status === 503
    && error.code === UPDATE_CODES.GITHUB_DEPLOY_NOT_CONFIGURED
  ))
  assert.equal(dispatched, 0)
})

test('rollback disabled when token missing', async () => {
  let dispatched = 0
  const service = serviceFor(clientFor({
    onDispatch: () => { dispatched += 1 },
  }), CURRENT, false)
  await assert.rejects(() => service.rollback(PREVIOUS, 'admin', true), (error: unknown) => (
    error instanceof UpdateError
    && error.status === 503
    && error.code === UPDATE_CODES.GITHUB_DEPLOY_NOT_CONFIGURED
  ))
  assert.equal(dispatched, 0)
})

test('token configured keeps normal install behavior', async () => {
  const service = serviceFor(clientFor({ latest: LATEST }), CURRENT, true)
  const check = await service.check()
  const status = await service.status()
  assert.equal(check.githubConfigured, true)
  assert.equal(status.githubConfigured, true)
  const result = await service.install('admin', true)
  assert.equal(result.status, 'queued')
})

test('no page crash when github check fails', async () => {
  const service = serviceFor({
    ...clientFor(),
    async latestMainCommit() {
      throw new UpdateError(UPDATE_CODES.GITHUB_UNAVAILABLE, 'GitHub bilgisi alınamadı.', 502)
    },
    async listWorkflowRuns() {
      throw new UpdateError(UPDATE_CODES.GITHUB_UNAVAILABLE, 'GitHub bilgisi alınamadı.', 502)
    },
  }, CURRENT, false)
  const status = await service.status()
  const check = await service.check()
  assert.equal(status.version, '1.1.0')
  assert.equal(check.currentVersion, '1.1.0')
})

test('workflow dispatch is blocked without token', async () => {
  const previous = process.env.GITHUB_DEPLOY_TOKEN
  delete process.env.GITHUB_DEPLOY_TOKEN
  assert.equal(hasGithubDeployToken(), false)
  await assert.rejects(() => githubActions.dispatch(), (error: unknown) => (
    error instanceof UpdateError
    && error.status === 503
    && error.code === UPDATE_CODES.GITHUB_DEPLOY_NOT_CONFIGURED
  ))
  if (previous === undefined) delete process.env.GITHUB_DEPLOY_TOKEN
  else process.env.GITHUB_DEPLOY_TOKEN = previous
})

test('no update', async () => {
  const service = serviceFor(clientFor({ latest: CURRENT }), CURRENT)
  const check = await service.check()
  assert.equal(check.updateAvailable, false)
  await assert.rejects(() => service.install('admin', true), (error: unknown) => (
    error instanceof UpdateError && error.status === 409 && error.code === UPDATE_CODES.NO_UPDATE
  ))
})

test('update available', async () => {
  const service = serviceFor(clientFor({ latest: LATEST }), CURRENT)
  const check = await service.check()
  assert.equal(check.updateAvailable, true)
  assert.equal(check.latestCommit, LATEST)
  assert.equal(check.latestAuthor, 'Berk')
})

test('update check does not dispatch', async () => {
  let dispatched = 0
  const service = serviceFor(clientFor({
    latest: LATEST,
    onDispatch: () => { dispatched += 1 },
  }), CURRENT)
  const check = await service.check()
  assert.equal(check.updateAvailable, true)
  assert.equal(dispatched, 0)
})

test('status does not dispatch', async () => {
  let dispatched = 0
  const service = serviceFor(clientFor({
    runs: [run({ status: 'in_progress', conclusion: null })],
    onDispatch: () => { dispatched += 1 },
  }))
  await service.status()
  assert.equal(dispatched, 0)
})

test('status survives github failure', async () => {
  const service = serviceFor({
    ...clientFor({ latest: LATEST }),
    async listWorkflowRuns() {
      throw new UpdateError(UPDATE_CODES.GITHUB_UNAVAILABLE, 'GitHub bilgisi alınamadı.', 502)
    },
  }, CURRENT)
  const status = await service.status()
  assert.equal(status.phase, 'idle')
  assert.equal(status.progress, 0)
  assert.equal(status.currentCommit, CURRENT)
  assert.equal(status.runId, null)
})

test('install dispatches once', async () => {
  let dispatched: string | undefined = 'not-called'
  const service = serviceFor(clientFor({
    latest: LATEST,
    onDispatch: (sha) => { dispatched = sha },
  }), CURRENT)
  const result = await service.install('admin-1', true)
  assert.equal(result.status, 'queued')
  assert.equal(result.commit, LATEST)
  assert.equal(result.progress, 0)
  assert.equal(result.previousRunId, 0)
  assert.equal(dispatched, undefined)
})

test('page load check and status do not dispatch', async () => {
  let dispatched = 0
  const service = serviceFor(clientFor({
    latest: LATEST,
    runs: [run({ status: 'completed', conclusion: 'success' })],
    onDispatch: () => { dispatched += 1 },
  }), CURRENT)
  await service.check()
  await service.status()
  assert.equal(dispatched, 0)
})

test('second install is 409 and does not dispatch again', async () => {
  let dispatched = 0
  const service = serviceFor(clientFor({
    latest: LATEST,
    onDispatch: () => { dispatched += 1 },
  }), CURRENT)
  await service.install('admin', true)
  await assert.rejects(() => service.install('admin', true), (error: unknown) => (
    error instanceof UpdateError && error.status === 409 && error.code === UPDATE_CODES.UPDATE_IN_PROGRESS
  ))
  assert.equal(dispatched, 1)
})

test('progress failure does not leak secrets', async () => {
  const mapped = mapDeployProgress(run({ status: 'completed', conclusion: 'failure' }), [
    { name: 'Upload token ghp_exampleprivatekey', status: 'completed', conclusion: 'failure' },
  ])
  assert.ok(mapped.errorMessage)
  assert.doesNotMatch(mapped.errorMessage, /ghp_|token|private key/i)
})

test('progress queued is 0', async () => {
  const mapped = mapDeployProgress(run({ status: 'queued', conclusion: null }))
  assert.equal(mapped.progress, 0)
  assert.equal(mapped.phaseLabel, 'İşlem sıraya alındı')
})

test('progress build maps to 40', async () => {
  const mapped = mapDeployProgress(run({ status: 'in_progress', conclusion: null }), [
    { name: 'Production build', status: 'in_progress', conclusion: null },
  ])
  assert.equal(mapped.progress, 40)
  assert.equal(mapped.phase, 'build')
})

test('progress deploy maps to 75', async () => {
  const mapped = mapDeployProgress(run({ status: 'in_progress', conclusion: null }), [
    { name: 'Upload to staging', status: 'in_progress', conclusion: null },
  ])
  assert.equal(mapped.progress, 75)
  assert.equal(mapped.phase, 'deploy')
})

test('progress health is 95', async () => {
  const mapped = mapDeployProgress(run({ status: 'in_progress', conclusion: null }), [
    { name: 'Health check', status: 'in_progress', conclusion: null },
  ])
  assert.equal(mapped.progress, 95)
})

test('progress success is 100', async () => {
  const mapped = mapDeployProgress(run({ status: 'completed', conclusion: 'success' }))
  assert.equal(mapped.progress, 100)
  assert.equal(mapped.phase, 'success')
})

test('progress failure is not 100', async () => {
  const mapped = mapDeployProgress(run({ status: 'completed', conclusion: 'failure' }), [
    { name: 'Upload to staging', status: 'completed', conclusion: 'failure' },
  ])
  assert.equal(mapped.progress, 75)
  assert.notEqual(mapped.progress, 100)
  assert.equal(mapped.phase, 'failed')
  assert.match(mapped.errorMessage || '', /Upload to staging/)
})

test('status restores active run', async () => {
  const service = serviceFor(clientFor({
    runs: [run({ status: 'in_progress', conclusion: null, id: 99 })],
    steps: [{ name: 'Upload to staging', status: 'in_progress', conclusion: null }],
  }))
  const status = await service.status()
  assert.equal(status.runId, 99)
  assert.equal(status.status, 'in_progress')
  assert.equal(status.progress, 75)
  assert.equal(status.phaseLabel, 'Sunucuya aktarılıyor')
})

test('duplicate update 409', async () => {
  const service = serviceFor(clientFor({
    latest: LATEST,
    runs: [run({ status: 'in_progress', conclusion: null })],
  }), CURRENT)
  await assert.rejects(() => service.install('admin', true), (error: unknown) => (
    error instanceof UpdateError && error.status === 409 && error.code === UPDATE_CODES.UPDATE_IN_PROGRESS
  ))
})

test('status queued', async () => {
  const service = serviceFor(clientFor({
    runs: [run({ status: 'queued', conclusion: null })],
  }))
  const status = await service.status()
  assert.equal(status.status, 'queued')
  assert.equal(status.phase, 'preparing')
  assert.equal(status.progress, 0)
  assert.equal(status.runId, 11)
})

test('status in_progress', async () => {
  const service = serviceFor(clientFor({
    runs: [run({ status: 'in_progress', conclusion: null })],
    steps: [{ name: 'Production build', status: 'in_progress', conclusion: null }],
  }))
  const status = await service.status()
  assert.equal(status.status, 'in_progress')
  assert.equal(status.phase, 'build')
  assert.equal(status.progress, 40)
})

test('idle status does not treat previous successful run as live deployment', async () => {
  const service = serviceFor(clientFor({
    runs: [run({ id: 100, status: 'completed', conclusion: 'success' })],
  }))
  const status = await service.status()
  assert.equal(status.status, 'completed')
  assert.equal(status.conclusion, null)
  assert.equal(status.phase, 'idle')
  assert.equal(status.progress, 0)
  assert.equal(status.runId, null)
  assert.equal(status.isTrackedDeployment, false)
  assert.equal(mapRunStatus(run({ status: 'completed', conclusion: 'success' })), 'completed')
  assert.equal(mapDeployPhase(run({ status: 'completed', conclusion: 'success' })), 'success')
})

test('status failed', async () => {
  const state = mapWorkflowState(run({ status: 'completed', conclusion: 'failure' }))
  assert.equal(state.status, 'completed')
  assert.equal(state.conclusion, 'failure')
  assert.equal(isActiveRun(run({ status: 'completed', conclusion: 'failure' })), false)
})

test('status cancelled', async () => {
  const state = mapWorkflowState(run({ status: 'completed', conclusion: 'cancelled' }))
  assert.equal(state.status, 'completed')
  assert.equal(state.conclusion, 'cancelled')
})

test('valid rollback', async () => {
  let dispatched = ''
  const service = serviceFor(clientFor({
    onDispatch: (sha) => { dispatched = sha || '' },
  }), CURRENT)
  const result = await service.rollback(PREVIOUS, 'admin', true)
  assert.equal(result.status, 'queued')
  assert.equal(result.commit, PREVIOUS)
  assert.equal(dispatched, PREVIOUS)
})

test('invalid rollback SHA', async () => {
  const service = serviceFor(clientFor({ existing: [CURRENT, LATEST, PREVIOUS, 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef'] }), CURRENT)
  await assert.rejects(() => service.rollback('main', 'admin', true), (error: unknown) => (
    error instanceof UpdateError && error.status === 400 && error.code === UPDATE_CODES.INVALID_SHA
  ))
  await assert.rejects(() => service.rollback('deadbeefdeadbeefdeadbeefdeadbeefdeadbeef', 'admin', true), (error: unknown) => (
    error instanceof UpdateError && error.status === 404 && error.code === UPDATE_CODES.COMMIT_NOT_FOUND
  ))
})

const OLD_SUCCESS = run({
  id: 100,
  status: 'completed',
  conclusion: 'success',
  created_at: '2026-08-18T12:00:00Z',
  updated_at: '2026-08-18T12:10:00Z',
  head_sha: CURRENT,
})

test('install does not report previous successful run as 100 percent', async () => {
  const runs = [OLD_SUCCESS]
  const service = serviceFor(clientFor({
    latest: LATEST,
    runs: () => runs,
  }), CURRENT)
  const installed = await service.install('admin', true)
  assert.equal(installed.previousRunId, 100)
  assert.equal(installed.progress, 0)
  const status = await service.status({
    previousRunId: installed.previousRunId,
    requestedAt: installed.requestedAt,
    targetCommit: installed.targetCommit,
  })
  assert.equal(status.progress, 0)
  assert.notEqual(status.progress, 100)
  assert.equal(status.runId, null)
  assert.equal(status.phase, 'preparing')
  assert.equal(status.phaseLabel, 'GitHub Actions başlatılıyor')
  assert.equal(status.isTrackedDeployment, true)
  assert.equal(status.status, 'queued')
})

test('status pins the new queued run after dispatch', async () => {
  const runs = [OLD_SUCCESS]
  const service = serviceFor(clientFor({
    latest: LATEST,
    runs: () => runs,
  }), CURRENT)
  const installed = await service.install('admin', true)
  runs.unshift(run({
    id: 101,
    status: 'queued',
    conclusion: null,
    created_at: new Date().toISOString(),
    head_sha: LATEST,
  }))
  const status = await service.status({
    previousRunId: installed.previousRunId,
    requestedAt: installed.requestedAt,
    targetCommit: installed.targetCommit,
  })
  assert.equal(status.runId, 101)
  assert.equal(status.progress, 0)
  assert.equal(status.status, 'queued')
  assert.equal(status.isTrackedDeployment, true)
})

test('tracked in-progress build is 40 not previous success', async () => {
  const runs = [OLD_SUCCESS]
  const steps = [{ name: 'Production build', status: 'in_progress', conclusion: null }]
  const service = serviceFor(clientFor({
    latest: LATEST,
    runs: () => runs,
    steps: () => steps,
  }), CURRENT)
  const installed = await service.install('admin', true)
  runs.unshift(run({
    id: 101,
    status: 'in_progress',
    conclusion: null,
    created_at: new Date().toISOString(),
    head_sha: LATEST,
  }))
  const status = await service.status({
    previousRunId: installed.previousRunId,
    requestedAt: installed.requestedAt,
    targetCommit: installed.targetCommit,
    runId: 101,
  })
  assert.equal(status.runId, 101)
  assert.equal(status.progress, 40)
  assert.equal(status.phase, 'build')
})

test('tracked success is 100 only for the new run', async () => {
  const runs = [OLD_SUCCESS]
  const service = serviceFor(clientFor({
    latest: LATEST,
    runs: () => runs,
  }), CURRENT)
  const installed = await service.install('admin', true)
  runs.unshift(run({
    id: 101,
    status: 'completed',
    conclusion: 'success',
    created_at: new Date().toISOString(),
    head_sha: LATEST,
  }))
  const status = await service.status({
    previousRunId: installed.previousRunId,
    requestedAt: installed.requestedAt,
    targetCommit: installed.targetCommit,
    runId: 101,
  })
  assert.equal(status.runId, 101)
  assert.equal(status.progress, 100)
  assert.equal(status.conclusion, 'success')
  assert.notEqual(status.runId, 100)
})

test('old successful run is never selected after install', async () => {
  const runs = [OLD_SUCCESS]
  const service = serviceFor(clientFor({
    latest: LATEST,
    runs: () => runs,
  }), CURRENT)
  const installed = await service.install('admin', true)
  const waiting = await service.status({
    previousRunId: installed.previousRunId,
    requestedAt: installed.requestedAt,
    targetCommit: LATEST,
  })
  assert.notEqual(waiting.runId, 100)
  runs.unshift(run({
    id: 101,
    status: 'queued',
    conclusion: null,
    created_at: new Date().toISOString(),
    head_sha: LATEST,
  }))
  const queued = await service.status({
    previousRunId: installed.previousRunId,
    requestedAt: installed.requestedAt,
    targetCommit: LATEST,
  })
  assert.equal(queued.runId, 101)
})

test('success progress panel stays visible after completion', () => {
  const panel = deploymentPanelState({
    installing: false,
    isTrackedDeployment: true,
    runId: 101,
    status: 'completed',
    conclusion: 'success',
    progress: 100,
    phaseLabel: 'Güncelleme başarıyla tamamlandı',
    persistedOutcome: 'success',
  })
  assert.equal(panel.show, true)
  assert.equal(panel.progress, 100)
  assert.equal(panel.outcome, 'success')
  assert.match(panel.phaseLabel, /başarıyla tamamlandı/)
})

test('install stays locked until tracked run is terminal', async () => {
  const runs = [OLD_SUCCESS]
  const service = serviceFor(clientFor({
    latest: LATEST,
    runs: () => runs,
  }), CURRENT)
  await service.install('admin', true)
  await assert.rejects(() => service.install('admin', true), (error: unknown) => (
    error instanceof UpdateError && error.status === 409 && error.code === UPDATE_CODES.UPDATE_IN_PROGRESS
  ))
  const waiting = deploymentPanelState({
    installing: true,
    isTrackedDeployment: true,
    runId: null,
    status: 'queued',
    conclusion: null,
    progress: 0,
    phaseLabel: 'GitHub Actions başlatılıyor',
    persistedOutcome: null,
  })
  assert.equal(waiting.installDisabled, true)
  assert.equal(waiting.progress, 0)
  assert.equal(waiting.show, true)
})

test('refresh recovers an active run but not an old success', async () => {
  const active = await serviceFor(clientFor({
    runs: [run({ id: 101, status: 'in_progress', conclusion: null }), OLD_SUCCESS],
    steps: [{ name: 'Production build', status: 'in_progress', conclusion: null }],
  })).status()
  assert.equal(active.runId, 101)
  assert.equal(active.progress, 40)
  assert.equal(active.isTrackedDeployment, true)

  const idle = await serviceFor(clientFor({
    runs: [OLD_SUCCESS],
  })).status()
  assert.equal(idle.runId, null)
  assert.equal(idle.progress, 0)
  assert.equal(idle.isTrackedDeployment, false)
})

test('page mount check and status never dispatch', async () => {
  let dispatched = 0
  const service = serviceFor(clientFor({
    latest: LATEST,
    runs: [OLD_SUCCESS],
    onDispatch: () => { dispatched += 1 },
  }), CURRENT)
  await service.check()
  await service.status()
  await service.check()
  await service.status()
  assert.equal(dispatched, 0)
})

test('new GitHub commit does not dispatch', async () => {
  let dispatched = 0
  const service = serviceFor(clientFor({
    latest: LATEST,
    onDispatch: () => { dispatched += 1 },
  }), CURRENT)
  const check = await service.check()
  assert.equal(check.updateAvailable, true)
  assert.equal(dispatched, 0)
})

test('install without explicit confirmation does not dispatch', async () => {
  let dispatched = 0
  const service = serviceFor(clientFor({
    latest: LATEST,
    onDispatch: () => { dispatched += 1 },
  }), CURRENT)
  await assert.rejects(() => service.install('admin'), (error: unknown) => (
    error instanceof UpdateError && error.status === 400 && error.code === UPDATE_CODES.CONFIRMATION_REQUIRED
  ))
  await assert.rejects(() => service.install('admin', false), (error: unknown) => (
    error instanceof UpdateError && error.code === UPDATE_CODES.CONFIRMATION_REQUIRED
  ))
  assert.equal(dispatched, 0)
})

test('rollback without explicit confirmation does not dispatch', async () => {
  let dispatched = 0
  const service = serviceFor(clientFor({
    onDispatch: () => { dispatched += 1 },
  }), CURRENT)
  await assert.rejects(() => service.rollback(PREVIOUS, 'admin'), (error: unknown) => (
    error instanceof UpdateError && error.code === UPDATE_CODES.CONFIRMATION_REQUIRED
  ))
  assert.equal(dispatched, 0)
})

test('modal open and cancel never dispatch', () => {
  assert.equal(countDispatches(['open-install']).dispatched, 0)
  assert.equal(countDispatches(['open-install']).progress, false)
  assert.equal(countDispatches(['open-install', 'cancel']).dispatched, 0)
  assert.equal(countDispatches(['open-install', 'cancel']).progress, false)
  assert.equal(countDispatches(['open-rollback', 'cancel']).dispatched, 0)
})

test('explicit confirm dispatches once and double confirm stays at one', () => {
  assert.equal(countDispatches(['open-install', 'confirm']).dispatched, 1)
  assert.equal(countDispatches(['open-install', 'confirm']).progress, true)
  assert.equal(countDispatches(['open-install', 'confirm', 'confirm']).dispatched, 1)
  assert.equal(countDispatches(['open-install', 'cancel', 'confirm']).dispatched, 0)
})

test('GET update routes are read-only and install GET is rejected', () => {
  const check = readFileSync('app/api/system/update/check/route.ts', 'utf8')
  const status = readFileSync('app/api/system/update/status/route.ts', 'utf8')
  const panel = readFileSync('components/admin/updates-panel.tsx', 'utf8')
  const install = readFileSync('app/api/system/update/install/route.ts', 'utf8')
  assert.doesNotMatch(check, /\.dispatch\(/)
  assert.doesNotMatch(status, /\.dispatch\(/)
  assert.match(check, /Never dispatches/)
  assert.match(status, /Never dispatches/)
  assert.match(install, /methodNotAllowed/)
  const effect = panel.match(/useEffect\(\(\) => \{[\s\S]*?\}, \[polling, loadStatus\]\)/)
  assert.ok(effect)
  assert.doesNotMatch(effect[0], /installConfirmed|rollbackConfirmed|\/install|\/rollback/)
})

test('production-deploy.yml is workflow_dispatch only', () => {
  const yml = readFileSync('.github/workflows/production-deploy.yml', 'utf8')
  assert.match(yml, /workflow_dispatch:/)
  assert.doesNotMatch(yml, /^on:\s*$[\s\S]*^\s+push:/m)
  assert.doesNotMatch(yml, /^\s+push:\s*$/m)
  assert.doesNotMatch(yml, /^\s+pull_request:\s*$/m)
  assert.match(yml, /Auto-deploy is disabled/)
})
