import { createClient } from '@supabase/supabase-js'
import { englishServices } from '@/lib/services-en'
import { services } from '@/lib/services'
import { hasSupabaseConfig, getSupabaseConfig } from '@/lib/supabase/config'
import { getNonIndexableLocalPaths } from '@/lib/local-seo/overrides'
import {
  buildLocalCitySitemapEntries,
  buildLocalServiceSitemapChunk,
  localServiceSitemapNames,
} from '@/lib/local-seo/sitemap'
import {
  buildEnLocalCitySitemapEntries,
  buildEnLocalServiceSitemapChunk,
} from '@/lib/local-seo/en-sitemap'
import { CHILD_SITEMAP_FILES, FALLBACK_CHILD_SITEMAP_FILES } from '@/lib/sitemap-index'
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
  if (!hasSupabaseConfig()) {
    console.warn('[sitemap] Supabase config missing; blog URLs omitted')
    return []
  }
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
      if (legacy.error) {
        console.error('[sitemap] blog query failed', legacy.error.message)
        return []
      }
      return (legacy.data || []).map((post) => ({ ...post, locale: 'tr' }))
    }
    if (error) {
      console.error('[sitemap] blog query failed', error.message)
      return []
    }
    return data || []
  } catch (error) {
    console.error('[sitemap] blog query threw', error)
    return []
  }
}

export async function turkishSitemapEntries(): Promise<SitemapEntry[]> {
  try {
    return buildTurkishSitemapEntries({
      posts: await publishedPosts('tr'),
      serviceSlugs: services.map((service) => service.slug),
    })
  } catch (error) {
    console.error('[sitemap] Turkish entries failed', error)
    return buildTurkishSitemapEntries()
  }
}

export async function englishSitemapEntries(): Promise<SitemapEntry[]> {
  try {
    return buildEnglishSitemapEntries({
      posts: await publishedPosts('en'),
      serviceSlugs: englishServices.map((service) => service.slug),
    })
  } catch (error) {
    console.error('[sitemap] English entries failed', error)
    return buildEnglishSitemapEntries()
  }
}

const trServiceSlugs = () => {
  try {
    return services.map((service) => service.slug).filter(Boolean)
  } catch (error) {
    console.error('[sitemap] Turkish service slugs failed', error)
    return []
  }
}

const enServiceSlugs = () => {
  try {
    return englishServices.map((service) => service.slug).filter(Boolean)
  } catch (error) {
    console.error('[sitemap] English service slugs failed', error)
    return []
  }
}

export async function turkishPageSitemapEntries() {
  try {
    return buildTurkishPageSitemapEntries({ serviceSlugs: trServiceSlugs() })
  } catch (error) {
    console.error('[sitemap] Turkish page entries failed', error)
    return buildTurkishPageSitemapEntries()
  }
}

export async function turkishBlogSitemapEntries() {
  try {
    return buildTurkishBlogSitemapEntries({ posts: await publishedPosts('tr') })
  } catch (error) {
    console.error('[sitemap] Turkish blog entries failed', error)
    return buildTurkishBlogSitemapEntries()
  }
}

export async function englishPageSitemapEntries() {
  try {
    return buildEnglishPageSitemapEntries({ serviceSlugs: enServiceSlugs() })
  } catch (error) {
    console.error('[sitemap] English page entries failed', error)
    return buildEnglishPageSitemapEntries()
  }
}

export async function englishBlogSitemapEntries() {
  try {
    return buildEnglishBlogSitemapEntries({ posts: await publishedPosts('en') })
  } catch (error) {
    console.error('[sitemap] English blog entries failed', error)
    return buildEnglishBlogSitemapEntries()
  }
}

export async function localCitySitemapEntries() {
  try {
    return buildLocalCitySitemapEntries()
  } catch (error) {
    console.error('[sitemap] local city entries failed', error)
    return []
  }
}

export async function localServiceSitemapChunk(index: number) {
  try {
    const excluded = await getNonIndexableLocalPaths()
    return buildLocalServiceSitemapChunk(index, { excluded })
  } catch (error) {
    console.error('[sitemap] local service chunk failed', error)
    return []
  }
}

export function sitemapIndexEntries(now = new Date()): SitemapEntry[] {
  try {
    return CHILD_SITEMAP_FILES.map((file) => ({ url: childSitemapPath(file), lastModified: now }))
  } catch (error) {
    console.error('[sitemap] index entries failed', error)
    return FALLBACK_CHILD_SITEMAP_FILES.map((file) => ({ url: childSitemapPath(file), lastModified: now }))
  }
}

export function fallbackSitemapIndexEntries(now = new Date()): SitemapEntry[] {
  return FALLBACK_CHILD_SITEMAP_FILES.map((file) => ({ url: childSitemapPath(file), lastModified: now }))
}

export async function childSitemapEntries(file: string): Promise<SitemapEntry[] | null> {
  try {
    if (file === 'tr-pages.xml') return await turkishPageSitemapEntries()
    if (file === 'tr-blog.xml') return await turkishBlogSitemapEntries()
    if (file === 'en-pages.xml') return await englishPageSitemapEntries()
    if (file === 'en-blog.xml') return await englishBlogSitemapEntries()
    if (file === 'local-cities.xml') return await localCitySitemapEntries()
    if (file === 'en-local-cities.xml') return buildEnLocalCitySitemapEntries()
    const enMatch = file.match(/^en-local-services-(\d+)\.xml$/)
    if (enMatch) {
      const enIdx = Number(enMatch[1]) - 1
      if (!Number.isInteger(enIdx) || enIdx < 0) return []
      return buildEnLocalServiceSitemapChunk(enIdx)
    }
    const match = file.match(/^local-services-(\d+)\.xml$/)
    if (!match) return null
    const index = Number(match[1]) - 1
    if (!Number.isInteger(index) || index < 0 || index >= localServiceSitemapNames().length) return []
    return localServiceSitemapChunk(index)
  } catch (error) {
    console.error('[sitemap] child entries failed', file, error)
    if (file.startsWith('en-')) return buildEnglishPageSitemapEntries()
    if (file.startsWith('tr-')) return buildTurkishPageSitemapEntries()
    return []
  }
}
