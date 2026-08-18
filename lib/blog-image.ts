export const BLOG_IMAGE_MAX_SIZE = 5 * 1024 * 1024
export const BLOG_IMAGE_FALLBACK = '/parsmedya-hero.png'

export const BLOG_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const

export function validateBlogImage(file: Pick<File, 'size' | 'type'>) {
  if (!BLOG_IMAGE_MIME_TYPES.includes(file.type as (typeof BLOG_IMAGE_MIME_TYPES)[number])) {
    throw new Error('Yalnız JPG, PNG, WebP veya GIF yükleyebilirsiniz.')
  }

  if (file.size > BLOG_IMAGE_MAX_SIZE) {
    throw new Error('Görsel boyutu en fazla 5 MB olabilir.')
  }
}

function isBlockedImageUrl(value: string) {
  return /^(blob:|file:)/i.test(value) || /localhost|127\.0\.0\.1|\/Users\//i.test(value)
}

export function isPersistentPublicImageUrl(value: string) {
  const url = value.trim()
  if (!url || isBlockedImageUrl(url)) return false
  if (url.startsWith('/') && !url.startsWith('//')) return true
  try {
    const parsed = new URL(url)
    return (
      parsed.protocol === 'https:' &&
      parsed.hostname.endsWith('.supabase.co') &&
      parsed.pathname.includes('/storage/v1/object/public/') &&
      !parsed.searchParams.has('token')
    )
  } catch {
    return false
  }
}

export function resolveBlogImageSrc(value?: string | null) {
  const url = value?.trim()
  if (!url || isBlockedImageUrl(url)) return BLOG_IMAGE_FALLBACK
  if (url.startsWith('/') && !url.startsWith('//')) return url
  try {
    const parsed = new URL(url)
    if (
      parsed.protocol === 'https:' &&
      parsed.hostname.endsWith('.supabase.co') &&
      parsed.pathname.includes('/storage/v1/object/')
    ) {
      return parsed.toString()
    }
  } catch {
    return BLOG_IMAGE_FALLBACK
  }
  return BLOG_IMAGE_FALLBACK
}
