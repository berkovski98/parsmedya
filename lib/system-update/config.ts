export const GITHUB_OWNER = 'berkovski98'
export const GITHUB_REPO = 'parsmedya'
export const HEALTH_ORIGIN = 'https://parsmedya.net'
export const HEALTH_PATHS = ['/', '/en', '/sitemap.xml', '/robots.txt'] as const
export const MAX_BACKUPS = 3
export const LOCK_STALE_MS = 30 * 60 * 1000

export interface UpdatePaths {
  appRoot: string
  deployRoot: string
  backupRoot: string
  stagingRoot: string
  downloadRoot: string
}

export const PRODUCTION_PATHS: UpdatePaths = {
  appRoot: '/home/parsmedya/parsmedya-app',
  deployRoot: '/home/parsmedya/deployments',
  backupRoot: '/home/parsmedya/deployments/backups',
  stagingRoot: '/home/parsmedya/deployments/staging',
  downloadRoot: '/home/parsmedya/deployments/downloads',
}

export function getGithubToken() {
  return process.env.GITHUB_UPDATE_TOKEN?.trim() || ''
}

export function productionZipName(version: string) {
  return `parsmedya-production-${version}.zip`
}
