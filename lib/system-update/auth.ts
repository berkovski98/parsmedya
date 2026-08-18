import { hasSupabaseConfig } from '../supabase/config'
import { createClient } from '../supabase/server'
import { UpdateError, UPDATE_CODES } from './errors'

export async function requireAdminApi() {
  if (!hasSupabaseConfig()) {
    throw new UpdateError(UPDATE_CODES.UNAUTHORIZED, 'Oturum doğrulanamadı.', 401)
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new UpdateError(UPDATE_CODES.UNAUTHORIZED, 'Oturum doğrulanamadı.', 401)
  }

  const { data: admin } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!admin) {
    throw new UpdateError(UPDATE_CODES.FORBIDDEN, 'Bu işlem için admin yetkisi gerekli.', 403)
  }

  return user
}
