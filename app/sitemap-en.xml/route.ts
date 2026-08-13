import { getPublishedPosts } from '@/lib/blog'
import { englishServices } from '@/lib/services-en'
import { getSiteUrl } from '@/lib/site-url'
import { blogLastModified, urlset, xmlResponse, type SitemapEntry } from '@/lib/sitemap'

export const revalidate = 3600

export async function GET() {
  const siteUrl = getSiteUrl()
  const now = new Date()
  const staticPaths = ['/en', '/en/about', '/en/vision', '/en/mission', '/en/services', '/en/blog', '/en/contact']
  const entries: SitemapEntry[] = [
    ...staticPaths.map((path) => ({ url: `${siteUrl}${path}`, lastModified: now })),
    ...englishServices.map((service) => ({ url: `${siteUrl}/en/services/${service.slug}`, lastModified: now })),
    ...(await getPublishedPosts(undefined, 'en')).map((post) => ({ url: `${siteUrl}/en/blog/${post.slug}`, lastModified: blogLastModified(post) })),
  ]
  return xmlResponse(urlset(entries))
}
