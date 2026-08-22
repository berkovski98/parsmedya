import 'server-only'
import { unstable_cache } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { hasSupabaseConfig } from '@/lib/supabase/config'
import type { BlogPost } from '@/lib/supabase/types'
import {
  BLOG_CACHE_ROOT_TAG,
  BLOG_REVALIDATE_SECONDS,
  blogPostCacheTag,
  blogPostsCacheTag,
} from '@/lib/blog-cache'

const listColumns = 'id,title,slug,excerpt,image_url,category,author,seo_title,seo_description,status,published_at,created_at,updated_at,locale,translation_group_id'
const legacyListColumns = 'id,title,slug,excerpt,image_url,category,author,seo_title,seo_description,status,published_at,created_at,updated_at'

async function queryPublishedPosts(limit: number | undefined, locale: 'tr' | 'en'): Promise<BlogPost[]> {
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
}

async function queryPublishedPost(slug: string, locale: 'tr' | 'en'): Promise<BlogPost | null> {
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
}

async function queryPublishedTranslation(translationGroupId: string, locale: 'tr' | 'en'): Promise<BlogPost | null> {
  if (!hasSupabaseConfig()) return null
  const { data, error } = await (await createClient())
    .from('blog_posts')
    .select(listColumns)
    .eq('translation_group_id', translationGroupId)
    .eq('locale', locale)
    .eq('status', 'published')
    .maybeSingle()
  return error || !data ? null : data as BlogPost
}

export async function getPublishedPosts(limit?: number, locale: 'tr' | 'en' = 'tr'): Promise<BlogPost[]> {
  const limitKey = limit === undefined ? 'all' : String(limit)
  return unstable_cache(
    () => queryPublishedPosts(limit, locale),
    ['published-posts', locale, limitKey],
    {
      tags: [BLOG_CACHE_ROOT_TAG, blogPostsCacheTag(locale)],
      revalidate: BLOG_REVALIDATE_SECONDS,
    },
  )()
}

export async function getPublishedPost(slug: string, locale: 'tr' | 'en' = 'tr'): Promise<BlogPost | null> {
  return unstable_cache(
    () => queryPublishedPost(slug, locale),
    ['published-post', locale, slug],
    {
      tags: [BLOG_CACHE_ROOT_TAG, blogPostsCacheTag(locale), blogPostCacheTag(locale, slug)],
      revalidate: BLOG_REVALIDATE_SECONDS,
    },
  )()
}

export async function getPublishedTranslation(translationGroupId: string | null, locale: 'tr' | 'en'): Promise<BlogPost | null> {
  if (!translationGroupId) return null
  return unstable_cache(
    () => queryPublishedTranslation(translationGroupId, locale),
    ['published-translation', translationGroupId, locale],
    {
      tags: [BLOG_CACHE_ROOT_TAG, blogPostsCacheTag(locale)],
      revalidate: BLOG_REVALIDATE_SECONDS,
    },
  )()
}

export function formatBlogDate(date: string | null, locale: 'tr' | 'en' = 'tr'): string {
  if (!date) return locale === 'en' ? 'Not published yet' : 'Henüz yayınlanmadı'
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(date))
}

export { parseContent, extractFaqs, countWords } from '@/lib/blog-content'
export type { ContentBlock, InlineNode } from '@/lib/blog-content'
