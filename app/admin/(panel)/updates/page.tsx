import { UpdatesPanel } from '@/components/admin/updates-panel'
import { requireAdmin } from '@/lib/supabase/auth'
import { GITHUB_READ_AVAILABLE, githubDeployConfigured } from '@/lib/system-update/config'
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
    error = error || (caught instanceof UpdateError ? caught.message : 'Güncelleme bilgisi alınamadı.')
  }
  return (
    <UpdatesPanel
      initialCheck={check}
      initialStatus={status}
      initialError={error || check?.githubError || ''}
      githubReadAvailable={check?.githubReadAvailable ?? GITHUB_READ_AVAILABLE}
      githubDeployConfigured={check?.githubDeployConfigured ?? status?.githubDeployConfigured ?? githubDeployConfigured()}
    />
  )
}
