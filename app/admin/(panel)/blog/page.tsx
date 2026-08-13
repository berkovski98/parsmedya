import Link from 'next/link'
import { deletePost } from '@/app/admin/actions'
import { DeleteButton } from '@/components/admin/delete-button'
import { createClient } from '@/lib/supabase/server'
import { formatBlogDate } from '@/lib/blog'
import type { BlogPost } from '@/lib/supabase/types'
import { requireAdmin } from '@/lib/supabase/auth'

export default async function AdminBlogPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string }> }) {
  await requireAdmin()
  const messages = await searchParams
  const { data } = await (await createClient()).from('blog_posts').select('*').order('updated_at', { ascending: false })
  const posts = (data || []) as BlogPost[]
  return <div className="mx-auto max-w-7xl"><div className="flex items-center justify-between gap-4"><div><h1 className="font-display text-3xl font-bold">Blog Yazıları</h1><p className="mt-2 text-muted-foreground">Taslak ve yayınlanmış içerikleri yönetin.</p></div><Link href="/admin/blog/new" className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">Yeni Yazı</Link></div>{messages.success && <p className="mt-6 rounded-lg border border-green-600/30 bg-green-600/10 p-3 text-sm text-green-800">{messages.success}</p>}{messages.error && <p className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{messages.error}</p>}<div className="mt-8 overflow-hidden rounded-xl border border-border bg-card"><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-secondary/60"><tr>{['Başlık','Kategori','Durum','Yayın tarihi','Güncellenme','İşlemler'].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead><tbody className="divide-y divide-border">{posts.map((post) => <tr key={post.id}><td className="max-w-xs px-4 py-4 font-medium">{post.title}</td><td className="px-4 py-4 text-muted-foreground">{post.category}</td><td className="px-4 py-4"><span className="rounded-full bg-secondary px-2.5 py-1 text-xs">{post.status === 'published' ? 'Yayında' : 'Taslak'}</span></td><td className="px-4 py-4 text-muted-foreground">{formatBlogDate(post.published_at)}</td><td className="px-4 py-4 text-muted-foreground">{formatBlogDate(post.updated_at)}</td><td className="px-4 py-4"><div className="flex gap-3"><Link href={`/admin/blog/${post.id}/edit`} className="font-medium text-accent hover:underline">Düzenle</Link>{post.status === 'published' && <Link href={`/blog/${post.slug}`} target="_blank" className="font-medium text-primary hover:underline">Görüntüle</Link>}<form action={deletePost}><input type="hidden" name="id" value={post.id} /><DeleteButton /></form></div></td></tr>)}{posts.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">Henüz blog yazısı yok.</td></tr>}</tbody></table></div></div></div>
}
