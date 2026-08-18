import { requireAdminApi } from '@/lib/system-update/auth'
import { fail, ok } from '@/lib/system-update/http'
import { getSystemUpdateService } from '@/lib/system-update/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Explicit user action only. Dispatches production-deploy workflow. */
export async function POST() {
  try {
    const admin = await requireAdminApi()
    return ok(await getSystemUpdateService().install(admin.id))
  } catch (error) {
    return fail(error)
  }
}
