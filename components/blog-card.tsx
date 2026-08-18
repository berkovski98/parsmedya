import Link from 'next/link'
import { ArrowRight, CalendarDays } from 'lucide-react'
import { BlogCoverImage } from '@/components/blog-cover-image'
import { formatBlogDate } from '@/lib/blog'
import type { BlogPost } from '@/lib/supabase/types'

interface BlogCardProps {
  post: BlogPost
  locale?: 'tr' | 'en'
}

export function BlogCard({ post, locale = 'tr' }: BlogCardProps) {
  const english = locale === 'en'
  const href = english ? `/en/blog/${post.slug}` : `/blog/${post.slug}`
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-lg hover:shadow-primary/5">
      <Link
        href={href}
        className="relative block aspect-[16/10] overflow-hidden bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        aria-label={english ? `Read ${post.title}` : `${post.title} yazısını oku`}
      >
        <BlogCoverImage
          src={post.image_url}
          alt={`${post.title} kapak görseli`}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/35 via-transparent to-transparent" />
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium">
          <span className="rounded-full bg-accent/10 px-2.5 py-1 text-accent">
            {post.category}
          </span>
          <time
            dateTime={post.published_at || undefined}
            className="inline-flex items-center gap-1.5 text-muted-foreground"
          >
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {formatBlogDate(post.published_at, locale)}
          </time>
        </div>

        <h3 className="mt-4 text-balance font-display text-lg font-semibold leading-snug text-foreground">
          <Link
            href={href}
            className="transition-colors hover:text-accent focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        <Link
          href={href}
          aria-label={english ? `${post.title}: Read more` : `${post.title}: Devamını Oku`}
          className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent/80 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {english ? 'Read More' : 'Devamını Oku'}
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  )
}
