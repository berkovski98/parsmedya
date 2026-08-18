'use client'

import Image from 'next/image'
import { useState } from 'react'
import { BLOG_IMAGE_FALLBACK, resolveBlogImageSrc } from '@/lib/blog-image'

export function BlogCoverImage({
  src,
  alt,
  sizes,
  priority = false,
  className,
}: {
  src?: string | null
  alt: string
  sizes: string
  priority?: boolean
  className?: string
}) {
  const resolved = resolveBlogImageSrc(src)
  const [current, setCurrent] = useState(resolved)

  return (
    <Image
      src={current}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={className}
      onError={() => {
        if (current !== BLOG_IMAGE_FALLBACK) setCurrent(BLOG_IMAGE_FALLBACK)
      }}
    />
  )
}
