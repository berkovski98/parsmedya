import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import AdmZip from 'adm-zip'
import { acquireLock, releaseLock } from '../lib/system-update/lock'
import { requireAdminApi } from '../lib/system-update/auth'
import { UpdateError, UPDATE_CODES } from '../lib/system-update/errors'
import { sha256, type GithubRelease } from '../lib/system-update/github'
import { SystemUpdateService, type GithubClient } from '../lib/system-update/service'
import { requestPassengerRestart } from '../lib/system-update/restart'
import { inspectZip } from '../lib/system-update/zip'
import type { HistoryStore } from '../lib/system-update/history'
import type { UpdatePaths } from '../lib/system-update/config'

async function tempPaths(): Promise<UpdatePaths & { root: string }> {
  const root = await mkdtemp(path.join(tmpdir(), 'pars-update-'))
  const paths: UpdatePaths = {
    appRoot: path.join(root, 'app'),
    deployRoot: path.join(root, 'deploy'),
    backupRoot: path.join(root, 'deploy', 'backups'),
    stagingRoot: path.join(root, 'deploy', 'staging'),
    downloadRoot: path.join(root, 'deploy', 'downloads'),
  }
  await mkdir(paths.appRoot, { recursive: true })
  await mkdir(paths.backupRoot, { recursive: true })
  await mkdir(paths.downloadRoot, { recursive: true })
  await seedApp(paths.appRoot, '1.0.5')
  return { ...paths, root }
}

async function seedApp(appRoot: string, version: string) {
  await mkdir(path.join(appRoot, '.next'), { recursive: true })
  await mkdir(path.join(appRoot, 'public'), { recursive: true })
  await mkdir(path.join(appRoot, 'node_modules'), { recursive: true })
  await writeFile(path.join(appRoot, 'server.js'), 'module.exports = {}\n')
  await writeFile(path.join(appRoot, 'package.json'), '{"name":"parsmedya"}\n')
  await writeFile(path.join(appRoot, '.next', 'BUILD_ID'), 'old\n')
  await writeFile(path.join(appRoot, 'public', 'ok.txt'), 'ok\n')
  await writeFile(path.join(appRoot, 'node_modules', '.keep'), '1\n')
  await writeFile(path.join(appRoot, '.env'), 'SECRET=keep-me\n')
  await writeFile(path.join(appRoot, 'version.json'), JSON.stringify({
    version,
    build: '2026.08.18.1',
    commit: 'old',
    createdAt: '2026-08-18T00:00:00.000Z',
  }))
}

function validZip(version: string) {
  const zip = new AdmZip()
  zip.addFile('server.js', Buffer.from('module.exports = { version: "' + version + '" }\n'))
  zip.addFile('package.json', Buffer.from('{"name":"parsmedya","version":"' + version + '"}\n'))
  zip.addFile('version.json', Buffer.from(JSON.stringify({
    version,
    build: '2026.08.18.2',
    commit: 'new',
    createdAt: '2026-08-18T12:00:00.000Z',
  })))
  zip.addFile('.next/BUILD_ID', Buffer.from(version))
  zip.addFile('public/ok.txt', Buffer.from('new\n'))
  zip.addFile('node_modules/.keep', Buffer.from('1\n'))
  return zip.toBuffer()
}

function releaseFor(version: string, buffer: Buffer, digest?: string): GithubRelease {
  const name = `parsmedya-production-${version}.zip`
  return {
    tag_name: `v${version}`,
    name: `v${version}`,
    body: `Release ${version}`,
    published_at: '2026-08-18T12:00:00Z',
    assets: [{
      id: 41,
      name,
      size: buffer.length,
      url: 'https://api.github.com/repos/berkovski98/parsmedya/releases/assets/41',
      browser_download_url: `https://github.com/berkovski98/parsmedya/releases/download/v${version}/${name}`,
      digest: `sha256:${digest || sha256(buffer)}`,
    }],
  }
}

function memoryHistory(): HistoryStore {
  const rows: { id: string; completed_at: string | null; status: string }[] = []
  return {
    async start() {
      const id = String(rows.length + 1)
      rows.push({ id, completed_at: null, status: 'started' })
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
      return rows.at(-1) || null
    },
  }
}

function clientFor(version: string, buffer: Buffer, digest?: string): GithubClient {
  const release = releaseFor(version, buffer, digest)
  return {
    async latest() { return release },
    async byVersion(requested) {
      if (requested !== version) {
        throw new UpdateError(UPDATE_CODES.RELEASE_NOT_FOUND, 'İstenen sürüm GitHub üzerinde bulunamadı.', 404)
      }
      return release
    },
    async download(_pkg, destination) {
      await mkdir(path.dirname(destination), { recursive: true })
      await writeFile(destination, buffer)
      return buffer
    },
  }
}

function serviceFor(paths: UpdatePaths, github: GithubClient, healthStatus = 200) {
  return new SystemUpdateService({
    paths,
    github,
    history: memoryHistory(),
    fetchHealth: async () => ({ status: healthStatus }),
    restart: requestPassengerRestart,
    healthRetries: 1,
    healthDelayMs: 0,
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

test('invalid version', async () => {
  const paths = await tempPaths()
  const service = serviceFor(paths, clientFor('1.0.6', validZip('1.0.6')))
  await assert.rejects(() => service.install('latest'), (error: unknown) => (
    error instanceof UpdateError && error.code === UPDATE_CODES.INVALID_VERSION
  ))
})

test('fake release', async () => {
  const paths = await tempPaths()
  const service = serviceFor(paths, clientFor('1.0.6', validZip('1.0.6')))
  await assert.rejects(() => service.install('9.9.9'), (error: unknown) => (
    error instanceof UpdateError && error.code === UPDATE_CODES.RELEASE_NOT_FOUND
  ))
})

test('corrupt zip', async () => {
  const paths = await tempPaths()
  const buffer = Buffer.from('not-a-zip')
  const service = serviceFor(paths, clientFor('1.0.6', buffer))
  await assert.rejects(() => service.install('1.0.6'), (error: unknown) => (
    error instanceof UpdateError && error.code === UPDATE_CODES.ZIP_INVALID
  ))
})

test('zip-slip', async () => {
  const zip = new AdmZip()
  zip.addFile('server.js', Buffer.from('ok'))
  zip.addFile('package.json', Buffer.from('{}'))
  zip.addFile('version.json', Buffer.from('{"version":"1.0.6"}'))
  zip.addFile('.next/BUILD_ID', Buffer.from('x'))
  zip.addFile('public/ok.txt', Buffer.from('x'))
  zip.addFile('node_modules/.keep', Buffer.from('x'))
  zip.addFile('ok/tmp/evil.js', Buffer.from('evil'))
  const planted = zip.toBuffer()
  const slipped = Buffer.from(planted.toString('latin1').replaceAll('ok/tmp/evil.js', '../tmp/evil.js'), 'latin1')
  assert.throws(() => inspectZip(slipped), (error: unknown) => (
    error instanceof UpdateError && error.code === UPDATE_CODES.ZIP_SLIP
  ))
})

test('missing server.js', async () => {
  const zip = new AdmZip()
  zip.addFile('package.json', Buffer.from('{}'))
  zip.addFile('version.json', Buffer.from('{"version":"1.0.6"}'))
  zip.addFile('.next/BUILD_ID', Buffer.from('x'))
  zip.addFile('public/ok.txt', Buffer.from('x'))
  zip.addFile('node_modules/.keep', Buffer.from('x'))
  assert.throws(() => inspectZip(zip.toBuffer()), (error: unknown) => (
    error instanceof UpdateError && error.code === UPDATE_CODES.PACKAGE_INVALID
  ))
})

test('duplicate deployment', async () => {
  const paths = await tempPaths()
  await acquireLock(paths.deployRoot)
  try {
    const service = serviceFor(paths, clientFor('1.0.6', validZip('1.0.6')))
    await assert.rejects(() => service.install('1.0.6'), (error: unknown) => (
      error instanceof UpdateError && error.status === 409 && error.code === UPDATE_CODES.CONFLICT
    ))
  } finally {
    await releaseLock(paths.deployRoot)
  }
})

test('successful staging', async () => {
  const paths = await tempPaths()
  const buffer = validZip('1.0.6')
  const service = serviceFor(paths, clientFor('1.0.6', buffer))
  const result = await service.install('1.0.6')
  assert.equal(result.version, '1.0.6')
  const version = JSON.parse(await readFile(path.join(paths.appRoot, 'version.json'), 'utf8')) as { version: string }
  assert.equal(version.version, '1.0.6')
  assert.equal(await readFile(path.join(paths.appRoot, '.env'), 'utf8'), 'SECRET=keep-me\n')
  assert.match(await readFile(path.join(paths.appRoot, 'tmp', 'restart.txt'), 'utf8'), /^\d+/)
  const status = await service.status()
  assert.equal(status.backupCount, 1)
  assert.equal(status.version, '1.0.6')
})

test('failed health check', async () => {
  const paths = await tempPaths()
  const service = serviceFor(paths, clientFor('1.0.6', validZip('1.0.6')), 500)
  await assert.rejects(() => service.install('1.0.6'), (error: unknown) => (
    error instanceof UpdateError && error.code === UPDATE_CODES.HEALTH_FAILED
  ))
  const version = JSON.parse(await readFile(path.join(paths.appRoot, 'version.json'), 'utf8')) as { version: string }
  assert.equal(version.version, '1.0.5')
})

test('rollback', async () => {
  const paths = await tempPaths()
  const service = serviceFor(paths, clientFor('1.0.6', validZip('1.0.6')))
  await service.install('1.0.6')
  const status = await service.status()
  const backupId = status.backups[0]?.id
  assert.ok(backupId)
  await service.rollback(backupId)
  const version = JSON.parse(await readFile(path.join(paths.appRoot, 'version.json'), 'utf8')) as { version: string }
  assert.equal(version.version, '1.0.5')
})
