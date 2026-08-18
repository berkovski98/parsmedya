import path from 'node:path'
import AdmZip from 'adm-zip'
import { mkdir, writeFile } from 'node:fs/promises'
import { UpdateError, UPDATE_CODES } from './errors'

const REQUIRED_FILES = ['server.js', 'package.json', 'version.json']
const REQUIRED_DIRS = ['.next/', 'public/', 'node_modules/']
const FORBIDDEN_BASENAMES = new Set([
  '.env',
  '.env.local',
  '.env.production',
  '.env.development',
  '.env.production.local',
  '.env.local.production',
  'id_rsa',
  'id_rsa.pub',
  'id_ed25519',
  'id_ed25519.pub',
  'credentials',
  'credentials.json',
  'service-account.json',
  'serviceAccountKey.json',
])

export function inspectZip(buffer: Buffer) {
  let zip: AdmZip
  try {
    zip = new AdmZip(buffer)
  } catch {
    throw new UpdateError(UPDATE_CODES.ZIP_INVALID, 'Paket açılamadı.', 400)
  }

  const entries = zip.getEntries()
  if (!entries.length) {
    throw new UpdateError(UPDATE_CODES.ZIP_INVALID, 'Paket boş veya bozuk.', 400)
  }

  const names = entries.map((entry) => normalizeEntryName(entry.entryName))
  for (const entry of entries) {
    assertSafeEntry(entry)
  }

  for (const required of REQUIRED_FILES) {
    if (!names.includes(required)) {
      throw new UpdateError(UPDATE_CODES.PACKAGE_INVALID, 'Paket zorunlu dosyaları içermiyor.', 400)
    }
  }
  for (const directory of REQUIRED_DIRS) {
    if (!names.some((name) => name === directory.slice(0, -1) || name.startsWith(directory))) {
      throw new UpdateError(UPDATE_CODES.PACKAGE_INVALID, 'Paket zorunlu dizinleri içermiyor.', 400)
    }
  }

  return zip
}

export async function extractZip(buffer: Buffer, stagingDir: string) {
  const zip = inspectZip(buffer)
  await mkdir(stagingDir, { recursive: true })
  const root = path.resolve(stagingDir)

  for (const entry of zip.getEntries()) {
    if (entry.isDirectory) {
      const directory = resolveInside(root, normalizeEntryName(entry.entryName))
      await mkdir(directory, { recursive: true })
      continue
    }
    const relative = normalizeEntryName(entry.entryName)
    const destination = resolveInside(root, relative)
    await mkdir(path.dirname(destination), { recursive: true })
    await writeFile(destination, entry.getData())
  }
}

function normalizeEntryName(value: string) {
  return value.replace(/\\/g, '/').replace(/^\.\/+/, '')
}

function assertSafeEntry(entry: AdmZip.IZipEntry) {
  const name = normalizeEntryName(entry.entryName)
  if (!name || name.includes('\0')) {
    throw new UpdateError(UPDATE_CODES.ZIP_SLIP, 'Paket içinde güvenli olmayan yol bulundu.', 400)
  }
  if (name.startsWith('/') || name.startsWith('~/') || /^[a-zA-Z]:/.test(name)) {
    throw new UpdateError(UPDATE_CODES.ZIP_SLIP, 'Paket içinde güvenli olmayan yol bulundu.', 400)
  }
  const posix = path.posix.normalize(name)
  if (posix.startsWith('../') || posix === '..' || posix.split('/').includes('..')) {
    throw new UpdateError(UPDATE_CODES.ZIP_SLIP, 'Paket içinde güvenli olmayan yol bulundu.', 400)
  }
  if (isSymlink(entry)) {
    throw new UpdateError(UPDATE_CODES.ZIP_SLIP, 'Paket içinde güvenli olmayan yol bulundu.', 400)
  }

  const parts = posix.split('/')
  if (parts.includes('.git') || posix === '.git' || posix.startsWith('.git/')) {
    throw new UpdateError(UPDATE_CODES.PACKAGE_INVALID, 'Paket yasaklı dosyalar içeriyor.', 400)
  }
  const base = parts[parts.length - 1] || ''
  if (FORBIDDEN_BASENAMES.has(base) || base.startsWith('.env')) {
    throw new UpdateError(UPDATE_CODES.PACKAGE_INVALID, 'Paket yasaklı dosyalar içeriyor.', 400)
  }
  if (base.endsWith('.pem') || base.endsWith('.p12') || base.endsWith('.key')) {
    throw new UpdateError(UPDATE_CODES.PACKAGE_INVALID, 'Paket yasaklı dosyalar içeriyor.', 400)
  }
}

function resolveInside(root: string, relative: string) {
  const destination = path.resolve(root, relative)
  const prefix = root.endsWith(path.sep) ? root : `${root}${path.sep}`
  if (destination !== root && !destination.startsWith(prefix)) {
    throw new UpdateError(UPDATE_CODES.ZIP_SLIP, 'Paket içinde güvenli olmayan yol bulundu.', 400)
  }
  return destination
}

function isSymlink(entry: AdmZip.IZipEntry) {
  const mode = ((entry.header as { attr?: number }).attr ?? 0) >>> 16
  return (mode & 0o170000) === 0o120000
}
