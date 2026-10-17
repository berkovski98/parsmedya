import { BLOG_IMAGE_FALLBACK, resolveBlogImageSrc } from '@/lib/blog-image'
import { orgRef } from '@/lib/schema/organization'
import { DEFAULT_SOCIAL_IMAGE } from '@/lib/seo'

/** Share/structured-data image: the post cover, or the 1200×630 brand card when there is none. */
export function blogShareImage(imageUrl?: string | null) {
  const src = resolveBlogImageSrc(imageUrl)
  return src === BLOG_IMAGE_FALLBACK ? DEFAULT_SOCIAL_IMAGE : src
}

/**
 * Posts signed by the team ("Pars Medya Ekibi") are attributed to the Organization instead of a
 * made-up Person; a real author name stays a Person.
 */
export function blogAuthorNode(author?: string | null) {
  const name = author?.trim()
  if (!name || /pars\s*medya/i.test(name)) {
    return orgRef()
  }
  return { '@type': 'Person', name }
}
