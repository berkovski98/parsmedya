import { sitemapIndex, sitemapIndexEntries, xmlResponse } from '@/lib/sitemap'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function GET() {
  return xmlResponse(sitemapIndex(sitemapIndexEntries()))
}
