import { createClient } from '@supabase/supabase-js'
import { getSupabaseConfig } from '@/lib/supabase/config'

export function createPublicSupabaseClient() {
  const { url, anonKey } = getSupabaseConfig()
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
