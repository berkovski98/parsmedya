import type { MetadataRoute } from 'next'
import { SITEMAP_INDEX_URLS } from '@/lib/sitemap-xml'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: [...SITEMAP_INDEX_URLS],
  }
}
