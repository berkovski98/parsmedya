import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { GITHUB_OWNER, GITHUB_REPO, getGithubToken, productionZipName } from './config'
import { UpdateError, UPDATE_CODES } from './errors'
import { isSemver, normalizeVersion } from './semver'

export interface GithubAsset {
  id: number
  name: string
  size: number
  url: string
  browser_download_url: string
  digest?: string | null
}

export interface GithubRelease {
  tag_name: string
  name: string | null
  body: string | null
  published_at: string | null
  assets: GithubAsset[]
}

export interface ReleasePackage {
  version: string
  releaseDate: string
  releaseNotes: string
  assetName: string
  assetSize: number
  assetId: number
  assetApiUrl: string
  sha256: string
  requiresMigration: boolean
  commit: string
}

const API = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`

function headers(accept = 'application/vnd.github+json') {
  const token = getGithubToken()
  const result: Record<string, string> = {
    Accept: accept,
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'parsmedya-system-update',
  }
  if (token) result.Authorization = `Bearer ${token}`
  return result
}

export async function githubRequest(url: string, accept?: string) {
  const response = await fetch(url, { headers: headers(accept), redirect: 'follow', cache: 'no-store' })
  return response
}

export async function fetchLatestRelease() {
  const response = await githubRequest(`${API}/releases/latest`)
  if (response.status === 404) {
    throw new UpdateError(UPDATE_CODES.RELEASE_NOT_FOUND, 'Yayınlanmış bir sürüm bulunamadı.', 404)
  }
  if (!response.ok) {
    throw new UpdateError(UPDATE_CODES.UPDATE_FAILED, 'Sürüm bilgisi alınamadı.', 502)
  }
  return (await response.json()) as GithubRelease
}

export async function fetchReleaseByVersion(version: string) {
  if (!isSemver(version)) {
    throw new UpdateError(UPDATE_CODES.INVALID_VERSION, 'Geçersiz sürüm numarası.', 400)
  }
  const normalized = normalizeVersion(version)
  for (const tag of [`v${normalized}`, normalized]) {
    const response = await githubRequest(`${API}/releases/tags/${encodeURIComponent(tag)}`)
    if (response.ok) return (await response.json()) as GithubRelease
    if (response.status !== 404) {
      throw new UpdateError(UPDATE_CODES.UPDATE_FAILED, 'Sürüm bilgisi alınamadı.', 502)
    }
  }
  throw new UpdateError(UPDATE_CODES.RELEASE_NOT_FOUND, 'İstenen sürüm GitHub üzerinde bulunamadı.', 404)
}

export function parseReleasePackage(release: GithubRelease, expectedVersion?: string): ReleasePackage {
  const version = normalizeVersion(release.tag_name || '')
  if (!isSemver(version)) {
    throw new UpdateError(UPDATE_CODES.INVALID_VERSION, 'Yayın etiketi geçerli bir sürüm değil.', 400)
  }
  if (expectedVersion && normalizeVersion(expectedVersion) !== version) {
    throw new UpdateError(UPDATE_CODES.RELEASE_NOT_FOUND, 'İstenen sürüm GitHub üzerinde bulunamadı.', 404)
  }

  const assetName = productionZipName(version)
  const asset = (release.assets || []).find((item) => item.name === assetName)
  if (!asset) {
    throw new UpdateError(UPDATE_CODES.ASSET_NOT_FOUND, 'Üretim paketi bu sürümde bulunamadı.', 400)
  }

  const notes = release.body || ''
  return {
    version,
    releaseDate: release.published_at || '',
    releaseNotes: notes,
    assetName: asset.name,
    assetSize: asset.size,
    assetId: asset.id,
    assetApiUrl: asset.url,
    sha256: extractSha256(release, asset),
    requiresMigration: /requires[-\s]?migration/i.test(notes),
    commit: '',
  }
}

export function extractSha256(release: GithubRelease, asset: GithubAsset) {
  const digest = asset.digest?.replace(/^sha256:/i, '').trim()
  if (digest && /^[a-f0-9]{64}$/i.test(digest)) return digest.toLowerCase()

  const checksumAsset = (release.assets || []).find((item) =>
    item.name === `${asset.name}.sha256` || item.name === 'SHA256SUMS' || item.name === 'checksums.txt',
  )
  const fromBody = (release.body || '').match(new RegExp(`(?:sha256|SHA-256)[:\\s]+([a-f0-9]{64})`, 'i'))
  if (fromBody?.[1]) return fromBody[1].toLowerCase()
  if (checksumAsset?.digest?.replace(/^sha256:/i, '')) {
    const value = checksumAsset.digest.replace(/^sha256:/i, '')
    if (/^[a-f0-9]{64}$/i.test(value)) return value.toLowerCase()
  }
  return ''
}

export function assertGithubAssetUrl(url: string) {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new UpdateError(UPDATE_CODES.ASSET_NOT_FOUND, 'Paket adresi geçersiz.', 400)
  }
  const allowedHost = parsed.hostname === 'api.github.com'
  const allowedPath = parsed.pathname === `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/assets/${parsed.pathname.split('/').pop()}`
    && parsed.pathname.startsWith(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/assets/`)
  if (!allowedHost || !allowedPath) {
    throw new UpdateError(UPDATE_CODES.ASSET_NOT_FOUND, 'Paket yalnızca GitHub Releases üzerinden indirilebilir.', 400)
  }
}

export async function downloadReleaseAsset(pkg: ReleasePackage, destination: string) {
  assertGithubAssetUrl(pkg.assetApiUrl)
  await mkdir(path.dirname(destination), { recursive: true })
  const response = await githubRequest(pkg.assetApiUrl, 'application/octet-stream')
  if (!response.ok || !response.body) {
    throw new UpdateError(UPDATE_CODES.UPDATE_FAILED, 'Üretim paketi indirilemedi.', 502)
  }
  const buffer = Buffer.from(await response.arrayBuffer())
  await writeFile(destination, buffer)
  return buffer
}

export function sha256(buffer: Buffer) {
  return createHash('sha256').update(buffer).digest('hex')
}

export function verifyChecksum(buffer: Buffer, expected: string) {
  if (!expected) {
    throw new UpdateError(UPDATE_CODES.CHECKSUM_MISSING, 'Paket imzası doğrulanamadı.', 400)
  }
  const actual = sha256(buffer)
  if (actual !== expected.toLowerCase()) {
    throw new UpdateError(UPDATE_CODES.CHECKSUM_MISMATCH, 'Paket bütünlüğü doğrulanamadı.', 400)
  }
  return actual
}
