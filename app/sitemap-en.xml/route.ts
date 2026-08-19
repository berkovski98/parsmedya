import { englishSitemapEntries, sitemapIndex, xmlResponse } from '@/lib/sitemap'
import { buildEnglishSitemapEntries, childSitemapPath } from '@/lib/sitemap-xml'
import type { SitemapEntry } from '@/lib/sitemap-xml'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

const EN_CHILD_FILES = ['en-pages.xml', 'en-blog.xml', 'en-local-cities.xml', 'en-local-services-1.xml', 'en-local-services-2.xml', 'en-local-services-3.xml'] as const

export async function GET() {
  try {
    const now = new Date()
    const entries: SitemapEntry[] = EN_CHILD_FILES.map((file) => ({
      url: childSitemapPath(file),
      lastModified: now,
    }))
    return xmlResponse(sitemapIndex(entries))
  } catch (error) {
    console.error('[sitemap] english sitemap index failed', error)
    try {
      const fallback = await englishSitemapEntries()
      const { urlset } = await import('@/lib/sitemap')
      return xmlResponse(urlset(fallback))
    } catch (fallbackError) {
      console.error('[sitemap] english fallback failed', fallbackError)
      const { urlset } = await import('@/lib/sitemap')
      return xmlResponse(urlset(buildEnglishSitemapEntries()))
    }
  }
}
