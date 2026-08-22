import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { hasSupabaseConfig } from '@/lib/supabase/config'
import type { BlogPost } from '@/lib/supabase/types'
import { cache } from 'react'

const listColumns = 'id,title,slug,excerpt,image_url,category,author,seo_title,seo_description,status,published_at,created_at,updated_at,locale,translation_group_id'
const legacyListColumns = 'id,title,slug,excerpt,image_url,category,author,seo_title,seo_description,status,published_at,created_at,updated_at'

export const getPublishedPosts = cache(async (limit?: number, locale: 'tr' | 'en' = 'tr'): Promise<BlogPost[]> => {
  if (!hasSupabaseConfig()) return []
  const supabase = await createClient()
  let query = supabase
    .from('blog_posts')
    .select(listColumns)
    .eq('status', 'published')
    .eq('locale', locale)
    .order('published_at', { ascending: false })
  if (limit) query = query.limit(limit)
  const { data, error } = await query
  if (error && locale === 'tr') {
    let fallback = supabase.from('blog_posts').select(legacyListColumns).eq('status', 'published').order('published_at', { ascending: false })
    if (limit) fallback = fallback.limit(limit)
    const legacy = await fallback
    return (legacy.data || []).map((post) => ({ ...post, locale: 'tr' as const, translation_group_id: null })) as BlogPost[]
  }
  if (error) return []
  return data as BlogPost[]
})

export const getPublishedPost = cache(async (slug: string, locale: 'tr' | 'en' = 'tr'): Promise<BlogPost | null> => {
  if (!hasSupabaseConfig()) return null
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .eq('locale', locale)
    .maybeSingle()
  if (error && locale === 'tr') {
    const legacy = await supabase.from('blog_posts').select('*').eq('slug', slug).eq('status', 'published').maybeSingle()
    return legacy.data ? ({ ...legacy.data, locale: 'tr', translation_group_id: null } as BlogPost) : null
  }
  if (error || !data) return null
  return data as BlogPost
})

export const getPublishedTranslation = cache(async (translationGroupId: string | null, locale: 'tr' | 'en'): Promise<BlogPost | null> => {
  if (!translationGroupId || !hasSupabaseConfig()) return null
  const { data, error } = await (await createClient()).from('blog_posts').select(listColumns).eq('translation_group_id', translationGroupId).eq('locale', locale).eq('status', 'published').maybeSingle()
  return error || !data ? null : data as BlogPost
})

export function formatBlogDate(date: string | null, locale: 'tr' | 'en' = 'tr'): string {
  if (!date) return locale === 'en' ? 'Not published yet' : 'Henüz yayınlanmadı'
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(date))
}

export { parseContent, extractFaqs, countWords } from '@/lib/blog-content'
export type { ContentBlock, InlineNode } from '@/lib/blog-content'
