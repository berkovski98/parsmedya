import { getSiteUrl } from '@/lib/site-url'
import { sitemapIndex, xmlResponse } from '@/lib/sitemap'

export const revalidate = 3600

export function GET() {
  const siteUrl = getSiteUrl()
  return xmlResponse(sitemapIndex([`${siteUrl}/sitemap-tr.xml`, `${siteUrl}/sitemap-en.xml`]))
}
