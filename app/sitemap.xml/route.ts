import { turkishSitemapEntries, urlset, xmlResponse } from '@/lib/sitemap'

export const revalidate = 3600

export async function GET() {
  return xmlResponse(urlset(await turkishSitemapEntries()))
}
