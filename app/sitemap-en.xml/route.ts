import { englishSitemapEntries, urlset, xmlResponse } from '@/lib/sitemap'
import { buildEnglishSitemapEntries } from '@/lib/sitemap-xml'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function GET() {
  try {
    return xmlResponse(urlset(await englishSitemapEntries()))
  } catch {
    return xmlResponse(urlset(buildEnglishSitemapEntries()))
  }
}
