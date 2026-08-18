import { createClient } from '@supabase/supabase-js'
import { englishServices } from '@/lib/services-en'
import { services } from '@/lib/services'
import { hasSupabaseConfig, getSupabaseConfig } from '@/lib/supabase/config'
import { getNonIndexableLocalPaths } from '@/lib/local-seo/overrides'
import {
  buildLocalCitySitemapEntries,
  buildLocalServiceSitemapEntries,
  chunkSitemapEntries,
  localServiceSitemapNames,
} from '@/lib/local-seo/sitemap'
import {
  buildEnglishBlogSitemapEntries,
  buildEnglishPageSitemapEntries,
  buildEnglishSitemapEntries,
  buildTurkishBlogSitemapEntries,
  buildTurkishPageSitemapEntries,
  buildTurkishSitemapEntries,
  childSitemapPath,
  type SitemapEntry,
  type SitemapPost,
} from '@/lib/sitemap-xml'

export type { SitemapEntry }
export { urlset, xmlResponse, blogLastModified, sitemapIndex } from '@/lib/sitemap-xml'

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

const trServiceSlugs = () => services.map((service) => service.slug)
const enServiceSlugs = () => englishServices.map((service) => service.slug)

export async function turkishPageSitemapEntries() {
  return buildTurkishPageSitemapEntries({ serviceSlugs: trServiceSlugs() })
}

export async function turkishBlogSitemapEntries() {
  return buildTurkishBlogSitemapEntries({ posts: await publishedPosts('tr') })
}

export async function englishPageSitemapEntries() {
  return buildEnglishPageSitemapEntries({ serviceSlugs: enServiceSlugs() })
}

export async function englishBlogSitemapEntries() {
  return buildEnglishBlogSitemapEntries({ posts: await publishedPosts('en') })
}

export async function localCitySitemapEntries() {
  return buildLocalCitySitemapEntries()
}

export async function localServiceSitemapChunks() {
  const excluded = await getNonIndexableLocalPaths()
  return chunkSitemapEntries(buildLocalServiceSitemapEntries({ excluded }))
}

export function sitemapIndexEntries(now = new Date()): SitemapEntry[] {
  const localFiles = ['local-cities.xml', ...localServiceSitemapNames()]
  const files = ['tr-pages.xml', 'tr-blog.xml', 'en-pages.xml', 'en-blog.xml', ...localFiles]
  return files.map((file) => ({ url: childSitemapPath(file), lastModified: now }))
}

export async function childSitemapEntries(file: string): Promise<SitemapEntry[] | null> {
  if (file === 'tr-pages.xml') return turkishPageSitemapEntries()
  if (file === 'tr-blog.xml') return turkishBlogSitemapEntries()
  if (file === 'en-pages.xml') return englishPageSitemapEntries()
  if (file === 'en-blog.xml') return englishBlogSitemapEntries()
  if (file === 'local-cities.xml') return localCitySitemapEntries()
  const match = file.match(/^local-services-(\d+)\.xml$/)
  if (!match) return null
  const chunks = await localServiceSitemapChunks()
  const index = Number(match[1]) - 1
  if (index < 0 || index >= chunks.length) return null
  return chunks[index]
}
