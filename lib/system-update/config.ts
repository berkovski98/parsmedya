export const GITHUB_OWNER = 'berkovski98'
export const GITHUB_REPO = 'parsmedya'
export const GITHUB_BRANCH = 'main'
export const WORKFLOW_FILE = 'production-deploy.yml'
export const HEALTH_ORIGIN = 'https://parsmedya.net'
export const HEALTH_PATHS = ['/', '/en', '/sitemap.xml', '/robots.txt', '/admin/login'] as const

export function getGithubDeployToken() {
  return process.env.GITHUB_DEPLOY_TOKEN?.trim() || ''
}

export function isCommitSha(value: string) {
  return /^[0-9a-f]{40}$/i.test(value.trim())
}

export function sameCommit(left: string, right: string) {
  const a = left.trim().toLowerCase()
  const b = right.trim().toLowerCase()
  if (!a || !b) return false
  return a === b || a.startsWith(b) || b.startsWith(a)
}
