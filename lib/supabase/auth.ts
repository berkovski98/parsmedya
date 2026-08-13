import 'server-only'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { hasSupabaseConfig } from '@/lib/supabase/config'

export async function getAdmin() {
  if (!hasSupabaseConfig()) return null
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: admin } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  return admin ? user : null
}

export async function requireAdmin() {
  const admin = await getAdmin()
  if (!admin) redirect('/admin/login')
  return admin
}
