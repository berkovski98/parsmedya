import { childSitemapEntries, urlset, xmlResponse } from '@/lib/sitemap'
import { buildEnglishPageSitemapEntries, buildTurkishPageSitemapEntries } from '@/lib/sitemap-xml'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  try {
    const { file } = await params
    const entries = await childSitemapEntries(file)
    if (entries === null) {
      return new Response('Not found', { status: 404 })
    }
    return xmlResponse(urlset(entries))
  } catch (error) {
    console.error('[sitemap] child route failed', error)
    try {
      const { file } = await params
      const fallback = file.startsWith('en-') ? buildEnglishPageSitemapEntries() : buildTurkishPageSitemapEntries()
      return xmlResponse(urlset(fallback))
    } catch (fallbackError) {
      console.error('[sitemap] child fallback failed', fallbackError)
      return xmlResponse(urlset([]))
    }
  }
}
