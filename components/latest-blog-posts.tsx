import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { BlogCard } from '@/components/blog-card'
import { buttonVariants } from '@/components/ui/button'
import { getPublishedPosts } from '@/lib/blog'

export async function LatestBlogPosts() {
  const latestPosts = await getPublishedPosts(3)

  return (
    <section
      aria-labelledby="latest-blog-heading"
      className="border-b border-border bg-secondary/40"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">
          Blog
        </p>
        <h2
          id="latest-blog-heading"
          className="mt-3 max-w-3xl text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
        >
          Blogdan Son Yazılar
        </h2>
        <p className="mt-5 max-w-4xl text-pretty leading-relaxed text-muted-foreground">
          Dijital pazarlama, web teknolojileri, marka yönetimi ve işletmelerin
          dijital dünyada büyümesine yardımcı olacak güncel içeriklerimizi
          keşfedin.
        </p>

        {latestPosts.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => <BlogCard key={post.slug} post={post} />)}
          </div>
        ) : (
          <p className="mt-10 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
            Yeni blog yazılarımız çok yakında burada olacak.
          </p>
        )}

        <div className="mt-10 flex justify-center sm:mt-12">
          <Link
            href="/blog"
            className={buttonVariants({
              size: 'lg',
              className: 'min-h-11 px-5',
            })}
          >
            Tüm Yazıları Gör
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
