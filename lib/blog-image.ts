export const BLOG_IMAGE_MAX_SIZE = 5 * 1024 * 1024

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
