import type { BlogPost } from '@/lib/supabase/types'

export type SitemapEntry = { url: string; lastModified: Date | string }

const escapeXml = (value: string) => value.replace(/[<>&'"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[character]!)

export function blogLastModified(post: BlogPost) {
  return post.updated_at || post.published_at || post.created_at
}

export function urlset(entries: SitemapEntry[]) {
  const urls = entries.map((entry) => `<url><loc>${escapeXml(entry.url)}</loc><lastmod>${new Date(entry.lastModified).toISOString()}</lastmod></url>`).join('')
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
}

export function sitemapIndex(urls: string[]) {
  const entries = urls.map((url) => `<sitemap><loc>${escapeXml(url)}</loc></sitemap>`).join('')
  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</sitemapindex>`
}

export const xmlResponse = (xml: string) => new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } })
