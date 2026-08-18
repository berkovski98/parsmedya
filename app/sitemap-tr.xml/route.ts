import { turkishSitemapEntries, urlset, xmlResponse } from '@/lib/sitemap'
import { buildTurkishSitemapEntries } from '@/lib/sitemap-xml'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function GET() {
  try {
    return xmlResponse(urlset(await turkishSitemapEntries()))
  } catch {
    return xmlResponse(urlset(buildTurkishSitemapEntries()))
  }
}
