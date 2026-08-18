import { UpdatesPanel } from '@/components/admin/updates-panel'
import { requireAdmin } from '@/lib/supabase/auth'
import { UpdateError } from '@/lib/system-update/errors'
import { getSystemUpdateService } from '@/lib/system-update/service'

export const dynamic = 'force-dynamic'

export default async function UpdatesPage() {
  await requireAdmin()
  const service = getSystemUpdateService()
  const status = await service.status()
  let check = null
  let error = ''
  try {
    check = await service.check()
  } catch (caught) {
    error = caught instanceof UpdateError ? caught.message : 'Güncelleme bilgisi alınamadı.'
  }
  return <UpdatesPanel initialCheck={check} initialStatus={status} initialError={error} />
}
