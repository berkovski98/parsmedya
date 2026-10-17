import Link from 'next/link'
import { ArrowUpRight, CalendarDays } from 'lucide-react'
import { BlogCoverImage } from '@/components/blog-cover-image'
import { formatBlogDate } from '@/lib/blog'
import { stagger } from '@/lib/motion'
import type { BlogPost } from '@/lib/supabase/types'

interface BlogCardProps {
  post: BlogPost
  locale?: 'tr' | 'en'
  /** Position in a grid; drives the reveal stagger. */
  index?: number
}

export function BlogCard({ post, locale = 'tr', index = 0 }: BlogCardProps) {
  const english = locale === 'en'
  const href = english ? `/en/blog/${post.slug}` : `/blog/${post.slug}`
  return (
    <article data-reveal style={stagger(index % 3)} className="group relative flex h-full flex-col">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-secondary">
        <BlogCoverImage
          src={post.image_url}
          alt={english ? `${post.title} cover image` : `${post.title} kapak görseli`}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute right-4 top-4 flex size-10 translate-y-2 items-center justify-center rounded-full bg-background text-foreground opacity-0 shadow-lg transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100" aria-hidden="true">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      <div className="flex flex-1 flex-col pt-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium">
          <span className="rounded-full bg-accent/10 px-2.5 py-1 text-accent-strong">
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

        <h3 className="mt-4 text-balance font-display text-xl font-bold leading-snug tracking-tight text-foreground">
          <Link
            href={href}
            className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 after:absolute after:inset-0 group-hover:bg-[length:100%_1px] focus-visible:outline-none focus-visible:after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-ring focus-visible:after:ring-offset-4"
          >
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        <span className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-accent-strong" aria-hidden="true">
          {english ? 'Read More' : 'Devamını Oku'}
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  )
}
