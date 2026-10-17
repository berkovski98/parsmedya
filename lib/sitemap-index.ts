/** Child sitemaps that never change name. Local service chunks are added per URL count. */
export const STATIC_CHILD_SITEMAP_FILES = [
  'tr-pages.xml',
  'tr-blog.xml',
  'en-pages.xml',
  'en-blog.xml',
  'local-cities.xml',
  'en-local-cities.xml',
] as const

/**
 * local-services-1..3.xml and en-local-services-1..3.xml were submitted before the index policy.
 * They keep answering 200 (an empty urlset when no longer needed) so old references never 404.
 */
export const LEGACY_LOCAL_SERVICE_CHUNKS = 3

/** Full pre-policy file list, kept for reference and backwards-compatible routing. */
export const CHILD_SITEMAP_FILES = [
  'tr-pages.xml',
  'tr-blog.xml',
  'en-pages.xml',
  'en-blog.xml',
  'local-cities.xml',
  'local-services-1.xml',
  'local-services-2.xml',
  'local-services-3.xml',
  'en-local-cities.xml',
  'en-local-services-1.xml',
  'en-local-services-2.xml',
  'en-local-services-3.xml',
] as const

export const FALLBACK_CHILD_SITEMAP_FILES = [
  'tr-pages.xml',
  'tr-blog.xml',
  'en-pages.xml',
  'en-blog.xml',
] as const

/** Index order: TR pages, TR blog, EN pages, EN blog, then local city and service files. */
export function childSitemapFiles(trServiceFiles: readonly string[], enServiceFiles: readonly string[]) {
  return [
    'tr-pages.xml',
    'tr-blog.xml',
    'en-pages.xml',
    'en-blog.xml',
    'local-cities.xml',
    ...trServiceFiles,
    'en-local-cities.xml',
    ...enServiceFiles,
  ]
}
