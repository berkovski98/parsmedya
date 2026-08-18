import { englishSitemapEntries, urlset, xmlResponse } from '@/lib/sitemap'

export const revalidate = 3600

export async function GET() {
  return xmlResponse(urlset(await englishSitemapEntries()))
}
