import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/auth'
import type { ContactMessage } from '@/lib/contact'
import { ContactList } from '@/components/admin/contact-list'

export default async function ContactMessagesPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string }> }) {
  await requireAdmin()
  const params = await searchParams
  const { data, error } = await (await createClient()).from('contact_messages').select('*').order('created_at', { ascending: false })
  const messages = (data || []) as ContactMessage[]
  return <div className="mx-auto max-w-7xl"><h1 className="font-display text-3xl font-bold">İletişim Talepleri</h1><p className="mt-2 text-muted-foreground">Web sitesinden gelen müşteri taleplerini takip edin, durumlarını ve dahili notlarınızı yönetin.</p>{params.success && <p className="mt-5 rounded-lg bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">{params.success}</p>}{(params.error || error) && <p className="mt-5 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{params.error || 'İletişim talepleri yüklenemedi. 003 migration dosyasını kontrol edin.'}</p>}<ContactList messages={messages} /></div>
}
