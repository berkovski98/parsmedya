import { BlogForm } from '@/components/admin/blog-form'
import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import type { BlogPost } from '@/lib/supabase/types'

export default async function NewBlogPage({ searchParams }: { searchParams: Promise<{ error?: string; locale?: string; translateFrom?: string }> }) {
  await requireAdmin()
  const { error, locale, translateFrom } = await searchParams
  let translationSource: BlogPost | undefined
  if (translateFrom) {
    const { data } = await (await createClient()).from('blog_posts').select('*').eq('id', translateFrom).maybeSingle()
    translationSource = data as BlogPost | undefined
  }
  const initialLocale = locale === 'en' ? 'en' : 'tr'
  return <div className="mx-auto max-w-5xl"><h1 className="font-display text-3xl font-bold">{translationSource ? 'Yeni Çeviri Oluştur' : 'Yeni Blog Yazısı'}</h1><p className="mt-2 text-muted-foreground">Yeni içeriğinizi hazırlayın ve yayın durumunu belirleyin.</p><div className="mt-8 rounded-xl border border-border bg-card p-5 sm:p-7"><BlogForm error={error} initialLocale={initialLocale} translationSource={translationSource} /></div></div>
}
