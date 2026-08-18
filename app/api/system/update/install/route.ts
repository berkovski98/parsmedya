import { requireAdminApi } from '@/lib/system-update/auth'
import { UpdateError, UPDATE_CODES } from '@/lib/system-update/errors'
import { fail, ok } from '@/lib/system-update/http'
import { getSystemUpdateService } from '@/lib/system-update/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function POST(request: Request) {
  try {
    const admin = await requireAdminApi()
    const body = await readJson(request)
    const version = typeof body.version === 'string' ? body.version : ''
    if (!version) {
      throw new UpdateError(UPDATE_CODES.INVALID_VERSION, 'Geçersiz sürüm numarası.', 400)
    }
    return ok(await getSystemUpdateService().install(version, admin.id))
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
