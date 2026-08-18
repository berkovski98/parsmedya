import Link from 'next/link'
import { deletePost } from '@/app/admin/actions'
import { DeleteButton } from '@/components/admin/delete-button'
import { formatBlogDate } from '@/lib/blog'
import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import type { BlogPost, BlogStatus } from '@/lib/supabase/types'

type Locale = BlogPost['locale']
type AdminBlogPost = Pick<BlogPost, 'id' | 'title' | 'slug' | 'category' | 'status' | 'published_at' | 'updated_at' | 'locale' | 'translation_group_id'>
type SearchParams = { success?: string; error?: string; q?: string; category?: string; status?: string }

const inputClass = 'rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20'

export async function AdminBlogList({ locale, searchParams }: { locale: Locale; searchParams: Promise<SearchParams> }) {
  await requireAdmin()
  const params = await searchParams
  const supabase = await createClient()
  const queryText = params.q?.trim() || ''
  const category = params.category?.trim() || ''
  const status = params.status === 'published' || params.status === 'draft' ? params.status as BlogStatus : ''

  let postsQuery = supabase
    .from('blog_posts')
    .select('id,title,slug,category,status,published_at,updated_at,locale,translation_group_id')
    .eq('locale', locale)
    .order('updated_at', { ascending: false })
  if (queryText) postsQuery = postsQuery.ilike('title', `%${queryText}%`)
  if (category) postsQuery = postsQuery.eq('category', category)
  if (status) postsQuery = postsQuery.eq('status', status)

  const oppositeLocale: Locale = locale === 'tr' ? 'en' : 'tr'
  const [postsResult, categoriesResult, translationsResult] = await Promise.all([
    postsQuery,
    supabase.from('blog_posts').select('category').eq('locale', locale).order('category'),
    supabase.from('blog_posts').select('id,translation_group_id').eq('locale', oppositeLocale).not('translation_group_id', 'is', null),
  ])
  const posts = (postsResult.data || []) as AdminBlogPost[]
  const categories = [...new Set((categoriesResult.data || []).map((item) => item.category).filter(Boolean))]
  const translations = new Map((translationsResult.data || []).map((item) => [item.translation_group_id, item.id]))
  const technicalCode = process.env.NODE_ENV === 'development' && postsResult.error ? ` (${postsResult.error.code})` : ''
  const isTurkish = locale === 'tr'

  return <div className="mx-auto max-w-7xl">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div><h1 className="font-display text-3xl font-bold">{isTurkish ? 'Türkçe Blog Yazıları' : 'İngilizce Blog Yazıları'}</h1><p className="mt-2 text-muted-foreground">{isTurkish ? 'Türkçe taslak ve yayınlanmış içerikleri yönetin.' : 'İngilizce taslak ve yayınlanmış içerikleri yönetin.'}</p></div>
      <Link href={`/admin/blog/new?locale=${locale}`} className="w-fit rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">Yeni Yazı</Link>
    </div>
    <div className="mt-6 flex gap-2 overflow-x-auto pb-1" aria-label="Blog dili">
      <Link href="/admin/blog" className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ${isTurkish ? 'bg-primary text-primary-foreground' : 'border border-border bg-card'}`}>Türkçe</Link>
      <Link href="/admin/blog/en" className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ${!isTurkish ? 'bg-primary text-primary-foreground' : 'border border-border bg-card'}`}>English</Link>
    </div>
    {params.success && <p className="mt-6 rounded-lg border border-green-600/30 bg-green-600/10 p-3 text-sm text-green-800">{params.success}</p>}
    {params.error && <p className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{params.error}</p>}
    <form className="mt-6 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-[minmax(220px,1fr)_220px_180px_auto]" action={locale === 'tr' ? '/admin/blog' : '/admin/blog/en'}>
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">Başlık ara<input name="q" defaultValue={queryText} placeholder="Yazı başlığı" className={inputClass} /></label>
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">Kategori<select name="category" defaultValue={category} className={inputClass}><option value="">Tüm kategoriler</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">Durum<select name="status" defaultValue={status} className={inputClass}><option value="">Tüm durumlar</option><option value="published">Yayında</option><option value="draft">Taslak</option></select></label>
      <div className="flex items-end gap-2"><button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Filtrele</button><Link href={locale === 'tr' ? '/admin/blog' : '/admin/blog/en'} className="rounded-lg border border-border px-4 py-2 text-sm">Temizle</Link></div>
    </form>
    {postsResult.error && <div role="alert" className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4"><p className="font-medium text-destructive">Blog yazıları yüklenemedi.{technicalCode}</p><p className="mt-1 text-sm text-muted-foreground">Veritabanı migration durumunu ve admin yetkilerini kontrol edin.</p></div>}
    {!postsResult.error && <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card"><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-secondary/60"><tr>{['Başlık', 'Kategori', 'Durum', 'Yayın tarihi', 'Güncellenme', 'İşlemler'].map((heading) => <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>)}</tr></thead><tbody className="divide-y divide-border">{posts.map((post) => {
      const linkedId = post.translation_group_id ? translations.get(post.translation_group_id) : undefined
      return <tr key={post.id}><td className="max-w-xs px-4 py-4 font-medium">{post.title}</td><td className="px-4 py-4 text-muted-foreground">{post.category}</td><td className="px-4 py-4"><span className="rounded-full bg-secondary px-2.5 py-1 text-xs">{post.status === 'published' ? 'Yayında' : 'Taslak'}</span></td><td className="px-4 py-4 text-muted-foreground">{formatBlogDate(post.published_at, locale)}</td><td className="px-4 py-4 text-muted-foreground">{formatBlogDate(post.updated_at, locale)}</td><td className="px-4 py-4"><div className="flex flex-wrap gap-3"><Link href={`/admin/blog/${post.id}/edit`} className="font-medium text-accent hover:underline">Düzenle</Link>{post.status === 'published' && <Link href={isTurkish ? `/tr/blog/${post.slug}` : `/en/blog/${post.slug}`} target="_blank" className="font-medium text-primary hover:underline">Görüntüle</Link>}{linkedId ? <Link href={`/admin/blog/${linkedId}/edit`} className="font-medium text-muted-foreground hover:underline">Çeviriyi Düzenle</Link> : <Link href={`/admin/blog/new?translateFrom=${post.id}`} className="font-medium text-muted-foreground hover:underline">{isTurkish ? 'İngilizce Versiyon Oluştur' : 'Türkçe Versiyon Oluştur'}</Link>}<form action={deletePost}><input type="hidden" name="id" value={post.id} /><input type="hidden" name="locale" value={locale} /><DeleteButton /></form></div></td></tr>
    })}{posts.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">Filtrelere uygun blog yazısı bulunamadı.</td></tr>}</tbody></table></div></div>}
  </div>
}
