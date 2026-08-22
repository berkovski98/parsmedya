import { revalidatePath, updateTag } from 'next/cache'

export const BLOG_REVALIDATE_SECONDS = 60

export const BLOG_CACHE_ROOT_TAG = 'blog-posts'

export function blogPostsCacheTag(locale: 'tr' | 'en') {
  return `blog-posts-${locale}`
}

export function blogPostCacheTag(locale: 'tr' | 'en', slug: string) {
  return `blog-post-${locale}-${slug}`
}

const SITEMAP_PATHS = [
  '/sitemap.xml',
  '/sitemap-tr.xml',
  '/sitemap-en.xml',
  '/sitemaps/tr-pages.xml',
  '/sitemaps/tr-blog.xml',
  '/sitemaps/en-pages.xml',
  '/sitemaps/en-blog.xml',
] as const

/** Bust blog list/detail data cache and related public routes after admin changes. */
export function revalidateBlogContent(options: { locale: 'tr' | 'en'; slug?: string }) {
  updateTag(BLOG_CACHE_ROOT_TAG)
  updateTag(blogPostsCacheTag('tr'))
  updateTag(blogPostsCacheTag('en'))

  if (options.slug) {
    updateTag(blogPostCacheTag(options.locale, options.slug))
    const detailPath = options.locale === 'tr' ? `/blog/${options.slug}` : `/en/blog/${options.slug}`
    revalidatePath(detailPath)
  }

  revalidatePath('/')
  revalidatePath('/blog')
  revalidatePath('/en')
  revalidatePath('/en/blog')

  for (const path of SITEMAP_PATHS) {
    revalidatePath(path)
  }
}
