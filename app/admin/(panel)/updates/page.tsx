import { UpdatesPanel } from '@/components/admin/updates-panel'
import { requireAdmin } from '@/lib/supabase/auth'
import { UpdateError } from '@/lib/system-update/errors'
import { getSystemUpdateService } from '@/lib/system-update/service'

export const dynamic = 'force-dynamic'

export default async function UpdatesPage() {
  await requireAdmin()
  const service = getSystemUpdateService()
  let check = null
  let status = null
  let error = ''
  try {
    status = await service.status()
  } catch (caught) {
    error = caught instanceof UpdateError ? caught.message : 'Dağıtım durumu alınamadı.'
  }
  try {
    check = await service.check()
  } catch (caught) {
    const message = caught instanceof UpdateError ? caught.message : 'Güncelleme bilgisi alınamadı.'
    error = error || message
  }
  return <UpdatesPanel initialCheck={check} initialStatus={status} initialError={error} />
}
