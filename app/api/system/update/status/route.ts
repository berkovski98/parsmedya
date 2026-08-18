import { requireAdminApi } from '@/lib/system-update/auth'
import { fail, ok } from '@/lib/system-update/http'
import { getSystemUpdateService } from '@/lib/system-update/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Read-only: latest production-deploy workflow status. Never dispatches a workflow. */
export async function GET() {
  try {
    await requireAdminApi()
    return ok(await getSystemUpdateService().status())
  } catch (error) {
    return fail(error)
  }
}
