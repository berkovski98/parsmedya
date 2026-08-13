import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { BlogPost } from '@/lib/supabase/types'
import { requireAdmin } from '@/lib/supabase/auth'
import { getAnalyticsSummary } from '@/lib/analytics'
import { MetricCards, TopPages } from '@/components/admin/analytics-widgets'
import type { ContactMessage } from '@/lib/contact'

export default async function DashboardPage() {
  await requireAdmin()
  const supabase = await createClient()
  // Dashboard is force-dynamic; these ranges intentionally use request time.
  // eslint-disable-next-line react-hooks/purity
  const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const todayStart = new Date().toISOString().slice(0, 10)
  const [{ data }, analytics, contactsResult, newContacts, todayContacts, weekContacts] = await Promise.all([
    supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
    getAnalyticsSummary(),
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('contact_messages').select('id', { count: 'exact', head: true }).gte('created_at', todayStart),
    supabase.from('contact_messages').select('id', { count: 'exact', head: true }).gte('created_at', weekStart),
  ])
  const posts = (data || []) as BlogPost[]
  const recentContacts = (contactsResult.data || []) as ContactMessage[]
  const blogMetrics = [
    { label: 'Toplam Türkçe Yazı', value: posts.filter((post) => post.locale === 'tr').length },
    { label: 'Toplam İngilizce Yazı', value: posts.filter((post) => post.locale === 'en').length },
    { label: 'Yayındaki Türkçe Yazı', value: posts.filter((post) => post.locale === 'tr' && post.status === 'published').length },
    { label: 'Yayındaki İngilizce Yazı', value: posts.filter((post) => post.locale === 'en' && post.status === 'published').length },
  ]
  const metrics = [
    { label: 'Bugünkü görüntülenme', value: analytics.today_views },
    { label: 'Son 7 gün', value: analytics.seven_day_views },
    { label: 'Son 30 gün', value: analytics.thirty_day_views },
    { label: 'Toplam görüntülenme', value: analytics.total_views },
    { label: 'Bugünkü tekil ziyaretçi', value: analytics.today_visitors },
    { label: 'Son 30 gün tekil ziyaretçi', value: analytics.thirty_day_visitors },
    { label: 'Toplam tekil ziyaretçi', value: analytics.total_visitors },
    { label: 'Yeni iletişim talepleri', value: newContacts.count || 0 },
    { label: 'Bugün gelen talepler', value: todayContacts.count || 0 },
    { label: 'Son 7 günde gelen talepler', value: weekContacts.count || 0 },
  ]
  return <div className="mx-auto max-w-7xl"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="font-display text-3xl font-bold">Dashboard</h1><p className="mt-2 text-muted-foreground">Gerçek ziyaret, iletişim ve blog yayın verilerinizi takip edin.</p></div><Link href="/admin/blog/new" className="w-fit rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">Yeni Yazı</Link></div><section className="mt-8"><h2 className="sr-only">Yönetim istatistikleri</h2><MetricCards items={metrics} /></section><div className="mt-8 grid gap-6 lg:grid-cols-2"><section className="rounded-xl border border-border bg-card p-6"><div className="flex items-center justify-between"><h2 className="font-display text-xl font-bold">En Çok Ziyaret Edilen Sayfalar</h2><Link href="/admin/analytics" className="text-sm font-medium text-accent hover:underline">Tüm istatistikler</Link></div><div className="mt-6"><TopPages pages={analytics.top_pages.slice(0, 7)} /></div></section><section className="rounded-xl border border-border bg-card p-6"><div className="flex items-center justify-between"><h2 className="font-display text-xl font-bold">Son İletişim Talepleri</h2><Link href="/admin/contact" className="text-sm font-medium text-accent hover:underline">Tüm talepler</Link></div><div className="mt-4 divide-y divide-border">{recentContacts.map((contact) => <Link key={contact.id} href={`/admin/contact/${contact.id}`} className="block py-3"><div className="flex items-center justify-between gap-3"><p className="truncate text-sm font-medium">{contact.name}</p><span className="text-xs text-muted-foreground">{new Date(contact.created_at).toLocaleDateString('tr-TR')}</span></div><p className="mt-1 truncate text-xs text-muted-foreground">{contact.subject || contact.email}</p></Link>)}{recentContacts.length === 0 && <p className="py-4 text-sm text-muted-foreground">Henüz iletişim talebi yok.</p>}</div></section><section className="rounded-xl border border-border bg-card p-6 lg:col-span-2"><h2 className="font-display text-xl font-bold">Blog Durumu</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{blogMetrics.map((item) => <div key={item.label} className="rounded-lg bg-secondary/60 p-4"><p className="text-xs text-muted-foreground">{item.label}</p><p className="mt-1 font-display text-2xl font-bold">{item.value}</p></div>)}</div><h3 className="mt-6 font-display font-semibold">Son Eklenen Yazılar</h3><div className="mt-2 divide-y divide-border">{posts.slice(0, 4).map((post) => <div key={post.id} className="py-3"><p className="truncate text-sm font-medium">{post.title}</p><p className="mt-1 text-xs text-muted-foreground">{post.locale.toUpperCase()} · {post.status === 'published' ? 'Yayında' : 'Taslak'}</p></div>)}{posts.length === 0 && <p className="py-4 text-sm text-muted-foreground">Henüz blog yazısı yok.</p>}</div></section></div></div>
}
