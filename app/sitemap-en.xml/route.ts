import { englishSitemapEntries, urlset, xmlResponse } from '@/lib/sitemap'
import { buildEnglishSitemapEntries } from '@/lib/sitemap-xml'
import { buildEnLocalCitySitemapEntries } from '@/lib/local-seo/en-sitemap'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function GET() {
  try {
    const base = await englishSitemapEntries()
    const local = buildEnLocalCitySitemapEntries()
    return xmlResponse(urlset([...base, ...local]))
  } catch (error) {
    console.error('[sitemap] english sitemap failed', error)
    try {
      return xmlResponse(urlset(buildEnglishSitemapEntries()))
    } catch (fallbackError) {
      console.error('[sitemap] english fallback failed', fallbackError)
      return xmlResponse(urlset([]))
    }
  }
}
