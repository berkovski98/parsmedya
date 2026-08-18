import { getPublishedPosts } from '@/lib/blog'
import { englishServices } from '@/lib/services-en'
import { services } from '@/lib/services'
import { absoluteUrl } from '@/lib/site-url'
import type { BlogPost } from '@/lib/supabase/types'

export type SitemapEntry = { url: string; lastModified: Date | string }

const TURKISH_STATIC_PATHS = ['/', '/hakkimizda', '/vizyonumuz', '/misyonumuz', '/hizmetler', '/blog', '/iletisim']
const ENGLISH_STATIC_PATHS = ['/en', '/en/about', '/en/vision', '/en/mission', '/en/services', '/en/blog', '/en/contact']

const escapeXml = (value: string) => value.replace(/[<>&'"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[character]!)

export function blogLastModified(post: BlogPost) {
  return post.updated_at || post.published_at || post.created_at
}

async function publishedPosts(locale: 'tr' | 'en') {
  try {
    return await getPublishedPosts(undefined, locale)
  } catch {
    return []
  }
}

export async function turkishSitemapEntries(): Promise<SitemapEntry[]> {
  const now = new Date()
  const posts = await publishedPosts('tr')
  return [
    ...TURKISH_STATIC_PATHS.map((path) => ({ url: absoluteUrl(path), lastModified: now })),
    ...services.map((service) => ({ url: absoluteUrl(`/hizmetler/${service.slug}`), lastModified: now })),
    ...posts.map((post) => ({ url: absoluteUrl(`/blog/${post.slug}`), lastModified: blogLastModified(post) })),
  ]
}

export async function englishSitemapEntries(): Promise<SitemapEntry[]> {
  const now = new Date()
  const posts = await publishedPosts('en')
  return [
    ...ENGLISH_STATIC_PATHS.map((path) => ({ url: absoluteUrl(path), lastModified: now })),
    ...englishServices.map((service) => ({ url: absoluteUrl(`/en/services/${service.slug}`), lastModified: now })),
    ...posts.map((post) => ({ url: absoluteUrl(`/en/blog/${post.slug}`), lastModified: blogLastModified(post) })),
  ]
}

export function urlset(entries: SitemapEntry[]) {
  const urls = entries.map((entry) => `<url><loc>${escapeXml(entry.url)}</loc><lastmod>${new Date(entry.lastModified).toISOString()}</lastmod></url>`).join('')
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
}

export const xmlResponse = (xml: string) => new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } })
