export const VISITOR_STORAGE_KEY = 'parsmedya_visitor_id'
export const SESSION_STORAGE_KEY = 'parsmedya_session_id'
export const LAST_PATH_STORAGE_KEY = 'parsmedya_last_tracked_path'

export function isAnalyticsDomEnabled(datasetValue?: string | null) {
  return datasetValue === 'on'
}

export function shouldSkipDuplicatePath(previousPath: string | null, pathname: string) {
  return Boolean(previousPath && previousPath === pathname)
}

export function createAnonymousId(existing?: string | null) {
  if (existing && existing.length >= 8) return existing
  return crypto.randomUUID()
}
