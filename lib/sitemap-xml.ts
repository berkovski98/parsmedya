import { canonicalAbsoluteUrl, isLocalhostHost, PRODUCTION_SITE_HOST, PRODUCTION_SITE_URL } from '@/lib/site-url'

export type SitemapPost = {
  slug: string
  status?: string | null
  locale?: string | null
  updated_at?: string | null
  published_at?: string | null
  created_at?: string | null
}

export type SitemapEntry = {
  url: string
  lastModified: Date | string
}

export const TURKISH_STATIC_PATHS = ['/', '/hakkimizda', '/vizyonumuz', '/misyonumuz', '/hizmetler', '/blog', '/iletisim'] as const
export const ENGLISH_STATIC_PATHS = ['/en', '/en/about', '/en/vision', '/en/mission', '/en/services', '/en/blog', '/en/contact'] as const

const TURKISH_ROUTE_MARKERS = ['/hakkimizda', '/vizyonumuz', '/vizyon', '/misyonumuz', '/misyon', '/hizmetler', '/iletisim']

export function sitemapPathname(url: string) {
  try {
    const pathname = new URL(url).pathname
    if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1)
    return pathname || '/'
  } catch {
    return url
  }
}

export function isEnglishPathname(pathname: string) {
  return pathname === '/en' || pathname.startsWith('/en/')
}

export function isTurkishPathname(pathname: string) {
  return !isEnglishPathname(pathname)
}

export function isCanonicalSitemapUrl(url: string) {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:') return false
    if (parsed.hostname !== PRODUCTION_SITE_HOST) return false
    if (isLocalhostHost(url)) return false
    return true
  } catch {
    return false
  }
}

export function locUrls(xml: string) {
  return [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map((match) => match[1].trim())
}

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[character]!)
}

export function blogLastModified(post: SitemapPost) {
  return post.updated_at || post.published_at || post.created_at || new Date().toISOString()
}

function publishedPostsForLocale(posts: SitemapPost[], locale: 'tr' | 'en') {
  return posts.filter((post) => {
    if (!post.slug?.trim()) return false
    if ((post.status || 'published') !== 'published') return false
    const postLocale = post.locale || 'tr'
    return postLocale === locale
  })
}

function uniqueEntries(entries: SitemapEntry[]) {
  const seen = new Set<string>()
  return entries.filter((entry) => {
    if (seen.has(entry.url)) return false
    seen.add(entry.url)
    return true
  })
}

export function filterSitemapEntries(entries: SitemapEntry[], locale: 'tr' | 'en') {
  return uniqueEntries(entries).filter((entry) => {
    if (!isCanonicalSitemapUrl(entry.url)) return false
    const pathname = sitemapPathname(entry.url)
    return locale === 'en' ? isEnglishPathname(pathname) : isTurkishPathname(pathname)
  })
}

export function buildTurkishSitemapEntries({
  posts = [],
  serviceSlugs = [],
  now = new Date(),
}: {
  posts?: SitemapPost[]
  serviceSlugs?: string[]
  now?: Date
} = {}): SitemapEntry[] {
  const published = publishedPostsForLocale(posts, 'tr')
  return filterSitemapEntries([
    ...TURKISH_STATIC_PATHS.map((path) => ({ url: canonicalAbsoluteUrl(path), lastModified: now })),
    ...serviceSlugs.map((slug) => ({ url: canonicalAbsoluteUrl(`/hizmetler/${slug}`), lastModified: now })),
    ...published.map((post) => ({ url: canonicalAbsoluteUrl(`/blog/${post.slug}`), lastModified: blogLastModified(post) })),
  ], 'tr')
}

export function buildEnglishSitemapEntries({
  posts = [],
  serviceSlugs = [],
  now = new Date(),
}: {
  posts?: SitemapPost[]
  serviceSlugs?: string[]
  now?: Date
} = {}): SitemapEntry[] {
  const published = publishedPostsForLocale(posts, 'en')
  return filterSitemapEntries([
    ...ENGLISH_STATIC_PATHS.map((path) => ({ url: canonicalAbsoluteUrl(path), lastModified: now })),
    ...serviceSlugs.map((slug) => ({ url: canonicalAbsoluteUrl(`/en/services/${slug}`), lastModified: now })),
    ...published.map((post) => ({ url: canonicalAbsoluteUrl(`/en/blog/${post.slug}`), lastModified: blogLastModified(post) })),
  ], 'en')
}

export function urlset(entries: SitemapEntry[]) {
  const urls = entries.map((entry) => `<url><loc>${escapeXml(entry.url)}</loc><lastmod>${new Date(entry.lastModified).toISOString()}</lastmod></url>`).join('')
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
}

export function containsForbiddenHost(xml: string) {
  return /localhost|127\.0\.0\.1/i.test(xml)
}

export function englishLocCount(xml: string) {
  return locUrls(xml).filter((url) => isEnglishPathname(sitemapPathname(url))).length
}

export function turkishLocCount(xml: string) {
  return locUrls(xml).filter((url) => isTurkishPathname(sitemapPathname(url))).length
}

export function hasTurkishRouteLeak(xml: string) {
  return locUrls(xml).some((url) => {
    const pathname = sitemapPathname(url)
    if (isEnglishPathname(pathname)) return false
    return TURKISH_ROUTE_MARKERS.some((marker) => pathname === marker || pathname.startsWith(`${marker}/`)) || pathname === '/blog' || pathname.startsWith('/blog/')
  })
}

export const xmlResponse = (xml: string) => new Response(xml, {
  headers: {
    'Content-Type': 'application/xml; charset=utf-8',
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
  },
})

export const SITEMAP_INDEX_URLS = [
  `${PRODUCTION_SITE_URL}/sitemap.xml`,
  `${PRODUCTION_SITE_URL}/sitemap-en.xml`,
] as const
