import { CHILD_SITEMAP_FILES, FALLBACK_CHILD_SITEMAP_FILES } from '@/lib/sitemap-index'
import { childSitemapPath, sitemapIndex, xmlResponse } from '@/lib/sitemap-xml'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

function indexXml(files: readonly string[], now = new Date()) {
  return sitemapIndex(files.map((file) => ({ url: childSitemapPath(file), lastModified: now })))
}

export async function GET() {
  try {
    return xmlResponse(indexXml(CHILD_SITEMAP_FILES))
  } catch (error) {
    console.error('[sitemap] index route failed', error)
    try {
      return xmlResponse(indexXml(FALLBACK_CHILD_SITEMAP_FILES))
    } catch (fallbackError) {
      console.error('[sitemap] fallback index failed', fallbackError)
      return xmlResponse(indexXml(['tr-pages.xml', 'en-pages.xml']))
    }
  }
}
