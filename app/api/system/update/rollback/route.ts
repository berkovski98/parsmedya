import { requireAdminApi } from '@/lib/system-update/auth'
import { UPDATE_CODES, UpdateError } from '@/lib/system-update/errors'
import { fail, methodNotAllowed, ok } from '@/lib/system-update/http'
import { isExplicitConfirmation } from '@/lib/system-update/intent'
import { getSystemUpdateService } from '@/lib/system-update/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  return methodNotAllowed('Geri alma yalnız onaylı POST ile başlar.')
}

/** Explicit confirmed user action only. Dispatches production-deploy for a previous SHA. */
export async function POST(request: Request) {
  try {
    const admin = await requireAdminApi()
    const body = await readJson(request)
    if (!isExplicitConfirmation(body.confirmed)) {
      throw new UpdateError(UPDATE_CODES.CONFIRMATION_REQUIRED, 'Geri alma için açık onay gerekli.', 400)
    }
    const commitSha = typeof body.commitSha === 'string' ? body.commitSha : ''
    if (!commitSha) {
      throw new UpdateError(UPDATE_CODES.INVALID_SHA, 'Geçersiz commit SHA.', 400)
    }
    return ok(await getSystemUpdateService().rollback(commitSha, admin.id, true))
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
