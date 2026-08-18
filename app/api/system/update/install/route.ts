import { requireAdminApi } from '@/lib/system-update/auth'
import { UPDATE_CODES, UpdateError } from '@/lib/system-update/errors'
import { fail, methodNotAllowed, ok } from '@/lib/system-update/http'
import { isExplicitConfirmation } from '@/lib/system-update/intent'
import { getSystemUpdateService } from '@/lib/system-update/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  return methodNotAllowed('Kurulum yalnız onaylı POST ile başlar.')
}

/** Explicit confirmed user action only. Dispatches production-deploy workflow. */
export async function POST(request: Request) {
  try {
    const admin = await requireAdminApi()
    const body = await readJson(request)
    if (!isExplicitConfirmation(body.confirmed)) {
      throw new UpdateError(UPDATE_CODES.CONFIRMATION_REQUIRED, 'Kurulum için açık onay gerekli.', 400)
    }
    return ok(await getSystemUpdateService().install(admin.id, true))
  } catch (error) {
    return fail(error)
  }
}

async function readJson(request: Request) {
  try {
    return await request.json() as Record<string, unknown>
  } catch {
    return {}
  }
}
