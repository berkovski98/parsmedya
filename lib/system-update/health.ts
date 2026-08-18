import { HEALTH_ORIGIN, HEALTH_PATHS } from './config'
import { UpdateError, UPDATE_CODES } from './errors'

export type HealthFetcher = (url: string) => Promise<{ status: number }>

export async function defaultHealthFetch(url: string) {
  const response = await fetch(url, { redirect: 'follow', cache: 'no-store', signal: AbortSignal.timeout(15_000) })
  return { status: response.status }
}

export async function runHealthChecks(fetchHealth: HealthFetcher = defaultHealthFetch, retries = 8, delayMs = 1000) {
  let lastError = 'Sağlık kontrolü başarısız.'
  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      const home = await fetchHealth(`${HEALTH_ORIGIN}/`)
      if (home.status !== 200) {
        lastError = 'Ana sayfa sağlık kontrolü başarısız.'
      } else {
        const rest = await Promise.all(HEALTH_PATHS.slice(1).map((item) => fetchHealth(`${HEALTH_ORIGIN}${item}`)))
        if (rest.every((item) => item.status >= 200 && item.status < 400)) return true
        lastError = 'Sağlık kontrolü başarısız.'
      }
    } catch {
      lastError = 'Sağlık kontrolü başarısız.'
    }
    if (attempt < retries - 1) await wait(delayMs)
  }
  throw new UpdateError(UPDATE_CODES.HEALTH_FAILED, lastError, 500)
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
