import { fallbackSitemapIndexEntries, sitemapIndexEntries } from '@/lib/sitemap'
import { sitemapIndex, xmlResponse } from '@/lib/sitemap-xml'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function GET() {
  try {
    return xmlResponse(sitemapIndex(await sitemapIndexEntries()))
  } catch (error) {
    console.error('[sitemap] index route failed', error)
    return xmlResponse(sitemapIndex(fallbackSitemapIndexEntries()))
  }
}
