import { requireAdminApi } from '@/lib/system-update/auth'
import { fail, ok } from '@/lib/system-update/http'
import { getSystemUpdateService } from '@/lib/system-update/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Read-only: GitHub commit comparison. Never dispatches a workflow. */
export async function GET() {
  try {
    await requireAdminApi()
    return ok(await getSystemUpdateService().check())
  } catch (error) {
    return fail(error)
  }
}
