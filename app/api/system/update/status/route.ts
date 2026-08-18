import { requireAdminApi } from '@/lib/system-update/auth'
import { fail, ok } from '@/lib/system-update/http'
import { getSystemUpdateService } from '@/lib/system-update/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function readQuery(request: Request) {
  const url = new URL(request.url)
  const runRaw = url.searchParams.get('runId')
  const previousRaw = url.searchParams.get('previousRunId')
  const runId = Number(runRaw || '')
  const previousRunId = Number(previousRaw || '')
  return {
    runId: runRaw && Number.isInteger(runId) && runId > 0 ? runId : null,
    previousRunId: previousRaw != null && previousRaw !== '' && Number.isInteger(previousRunId) && previousRunId >= 0 ? previousRunId : null,
    requestedAt: url.searchParams.get('requestedAt') || null,
    targetCommit: url.searchParams.get('targetCommit') || null,
  }
}

/** Read-only: tracked or active production-deploy workflow status. Never dispatches a workflow. */
export async function GET(request: Request) {
  try {
    await requireAdminApi()
    return ok(await getSystemUpdateService().status(readQuery(request)))
  } catch (error) {
    return fail(error)
  }
}
