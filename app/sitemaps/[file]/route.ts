import { childSitemapEntries, urlset, xmlResponse } from '@/lib/sitemap'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params
  const entries = await childSitemapEntries(file)
  if (!entries) {
    return new Response('Not found', { status: 404 })
  }
  return xmlResponse(urlset(entries))
}
