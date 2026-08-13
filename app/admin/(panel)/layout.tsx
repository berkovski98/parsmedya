import { AdminShell } from '@/components/admin/admin-shell'
import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  const { count } = await (await createClient()).from('contact_messages').select('id', { count: 'exact', head: true }).eq('status', 'new')
  return <AdminShell newContactCount={count || 0}>{children}</AdminShell>
}
