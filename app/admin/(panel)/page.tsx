import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { BlogPost } from '@/lib/supabase/types'
import { requireAdmin } from '@/lib/supabase/auth'

export default async function DashboardPage() {
  await requireAdmin()
  const supabase = await createClient()
  const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
  const posts = (data || []) as BlogPost[]
  const cards = [{ label: 'Toplam blog yazısı', value: posts.length }, { label: 'Yayındaki yazılar', value: posts.filter((p) => p.status === 'published').length }, { label: 'Taslaklar', value: posts.filter((p) => p.status === 'draft').length }]
  return <div className="mx-auto max-w-6xl"><div className="flex items-center justify-between gap-4"><div><h1 className="font-display text-3xl font-bold">Dashboard</h1><p className="mt-2 text-muted-foreground">Blog yayınlarınızın genel durumunu takip edin.</p></div><Link href="/admin/blog/new" className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">Yeni Yazı</Link></div><div className="mt-8 grid gap-4 sm:grid-cols-3">{cards.map((card) => <div key={card.label} className="rounded-xl border border-border bg-card p-6"><p className="text-sm text-muted-foreground">{card.label}</p><p className="mt-2 font-display text-3xl font-bold text-foreground">{card.value}</p></div>)}</div><section className="mt-8 rounded-xl border border-border bg-card p-6"><h2 className="font-display text-xl font-bold">Son Eklenen Yazılar</h2><div className="mt-4 divide-y divide-border">{posts.slice(0, 5).map((post) => <div key={post.id} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium">{post.title}</p><p className="text-sm text-muted-foreground">{post.category}</p></div><span className="text-xs font-medium uppercase text-muted-foreground">{post.status === 'published' ? 'Yayında' : 'Taslak'}</span></div>)}{posts.length === 0 && <p className="py-6 text-sm text-muted-foreground">Henüz blog yazısı yok.</p>}</div></section></div>
}
