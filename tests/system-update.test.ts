import assert from 'node:assert/strict'
import { test } from 'node:test'
import { requireAdminApi } from '../lib/system-update/auth'
import { UPDATE_CODES, UpdateError } from '../lib/system-update/errors'
import { isActiveRun, mapDeployPhase, mapDeployProgress, mapRunStatus, mapWorkflowState, type GithubActionsClient, type GithubWorkflowRun } from '../lib/system-update/github'
import { SystemUpdateService } from '../lib/system-update/service'
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
  runs?: GithubWorkflowRun[]
  existing?: string[]
  onDispatch?: (sha?: string) => void
  steps?: { name: string; status: string; conclusion: string | null }[]
} = {}): GithubActionsClient {
  const existing = new Set((options.existing || [CURRENT, LATEST, PREVIOUS]).map((sha) => sha.toLowerCase()))
  return {
    async latestMainCommit() {
      const sha = options.latest || LATEST
      return { sha, message: 'feat: production deploy', date: '2026-08-18T12:00:00Z', author: 'Berk' }
    },
    async commitExists(sha) {
      return existing.has(sha.toLowerCase())
    },
    async listWorkflowRuns() {
      return options.runs || []
    },
    async listJobSteps() {
      return options.steps || []
    },
    async dispatch(sha) {
      options.onDispatch?.(sha)
    },
  }
}

function serviceFor(github: GithubActionsClient, commit = CURRENT) {
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

test('no update', async () => {
  const service = serviceFor(clientFor({ latest: CURRENT }), CURRENT)
  const check = await service.check()
  assert.equal(check.updateAvailable, false)
  await assert.rejects(() => service.install('admin'), (error: unknown) => (
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
  const result = await service.install('admin-1')
  assert.equal(result.status, 'queued')
  assert.equal(result.commit, LATEST)
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
  await service.install('admin')
  await assert.rejects(() => service.install('admin'), (error: unknown) => (
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
  await assert.rejects(() => service.install('admin'), (error: unknown) => (
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

test('status success', async () => {
  const service = serviceFor(clientFor({
    runs: [run({ status: 'completed', conclusion: 'success' })],
  }))
  const status = await service.status()
  assert.equal(status.status, 'completed')
  assert.equal(status.conclusion, 'success')
  assert.equal(status.phase, 'success')
  assert.equal(status.progress, 100)
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
  const result = await service.rollback(PREVIOUS, 'admin')
  assert.equal(result.status, 'queued')
  assert.equal(result.commit, PREVIOUS)
  assert.equal(dispatched, PREVIOUS)
})

test('invalid rollback SHA', async () => {
  const service = serviceFor(clientFor({ existing: [CURRENT, LATEST, PREVIOUS, 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef'] }), CURRENT)
  await assert.rejects(() => service.rollback('main', 'admin'), (error: unknown) => (
    error instanceof UpdateError && error.status === 400 && error.code === UPDATE_CODES.INVALID_SHA
  ))
  await assert.rejects(() => service.rollback('deadbeefdeadbeefdeadbeefdeadbeefdeadbeef', 'admin'), (error: unknown) => (
    error instanceof UpdateError && error.status === 404 && error.code === UPDATE_CODES.COMMIT_NOT_FOUND
  ))
})
