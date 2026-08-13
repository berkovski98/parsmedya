import { AdminShell } from '@/components/admin/admin-shell'
import { requireAdmin } from '@/lib/supabase/auth'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  return <AdminShell>{children}</AdminShell>
}
