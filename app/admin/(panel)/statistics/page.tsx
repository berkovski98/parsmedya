import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/supabase/auth'

export default async function StatisticsRedirectPage() {
  await requireAdmin()
  redirect('/admin/analytics')
}
