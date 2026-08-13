import { getPublishedPosts } from '@/lib/blog'
import { services } from '@/lib/services'
import { getSiteUrl } from '@/lib/site-url'
import { blogLastModified, urlset, xmlResponse, type SitemapEntry } from '@/lib/sitemap'

export const revalidate = 3600

export async function GET() {
  const siteUrl = getSiteUrl()
  const now = new Date()
  const staticPaths = ['', '/hakkimizda', '/vizyonumuz', '/misyonumuz', '/hizmetler', '/blog', '/iletisim']
  const entries: SitemapEntry[] = [
    ...staticPaths.map((path) => ({ url: `${siteUrl}${path || '/'}`, lastModified: now })),
    ...services.map((service) => ({ url: `${siteUrl}/hizmetler/${service.slug}`, lastModified: now })),
    ...(await getPublishedPosts(undefined, 'tr')).map((post) => ({ url: `${siteUrl}/blog/${post.slug}`, lastModified: blogLastModified(post) })),
  ]
  return xmlResponse(urlset(entries))
}
