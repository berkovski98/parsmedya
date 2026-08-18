const SEMVER = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/

export function normalizeVersion(value: string) {
  return value.trim().replace(/^v/i, '')
}

export function isSemver(value: string) {
  return SEMVER.test(value.trim())
}

export function compareSemver(left: string, right: string) {
  const a = parse(left)
  const b = parse(right)
  for (const key of ['major', 'minor', 'patch'] as const) {
    if (a[key] > b[key]) return 1
    if (a[key] < b[key]) return -1
  }
  if (a.prerelease === b.prerelease) return 0
  if (!a.prerelease) return 1
  if (!b.prerelease) return -1
  return a.prerelease < b.prerelease ? -1 : 1
}

function parse(value: string) {
  const match = value.trim().match(SEMVER)
  if (!match) {
    throw new Error('INVALID_VERSION')
  }
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: match[4] || '',
  }
}
