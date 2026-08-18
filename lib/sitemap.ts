import { createClient } from '@supabase/supabase-js'
import { englishServices } from '@/lib/services-en'
import { services } from '@/lib/services'
import { hasSupabaseConfig, getSupabaseConfig } from '@/lib/supabase/config'
import {
  buildEnglishSitemapEntries,
  buildTurkishSitemapEntries,
  type SitemapEntry,
  type SitemapPost,
} from '@/lib/sitemap-xml'

export type { SitemapEntry }
export { urlset, xmlResponse, blogLastModified } from '@/lib/sitemap-xml'

const postColumns = 'slug,status,locale,updated_at,published_at,created_at'
const legacyColumns = 'slug,status,updated_at,published_at,created_at'

function publicSupabase() {
  const { url, anonKey } = getSupabaseConfig()
  return createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } })
}

async function publishedPosts(locale: 'tr' | 'en'): Promise<SitemapPost[]> {
  if (!hasSupabaseConfig()) return []
  try {
    const supabase = publicSupabase()
    const { data, error } = await supabase
      .from('blog_posts')
      .select(postColumns)
      .eq('status', 'published')
      .eq('locale', locale)
      .order('published_at', { ascending: false })

    if (error && locale === 'tr') {
      const legacy = await supabase
        .from('blog_posts')
        .select(legacyColumns)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
      return (legacy.data || []).map((post) => ({ ...post, locale: 'tr' }))
    }
    if (error || !data) return []
    return data
  } catch {
    return []
  }
}

export async function turkishSitemapEntries(): Promise<SitemapEntry[]> {
  return buildTurkishSitemapEntries({
    posts: await publishedPosts('tr'),
    serviceSlugs: services.map((service) => service.slug),
  })
}

export async function englishSitemapEntries(): Promise<SitemapEntry[]> {
  return buildEnglishSitemapEntries({
    posts: await publishedPosts('en'),
    serviceSlugs: englishServices.map((service) => service.slug),
  })
}
