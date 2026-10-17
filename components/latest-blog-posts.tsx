import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { BlogCard } from '@/components/blog-card'
import { getPublishedPosts } from '@/lib/blog'

export async function LatestBlogPosts({ locale = 'tr' }: { locale?: 'tr' | 'en' }) {
  const isEnglish = locale === 'en'
  const latestPosts = await getPublishedPosts(3, locale)
  const href = isEnglish ? '/en/blog' : '/blog'
  const allLabel = isEnglish ? 'View All Articles' : 'Tüm Yazıları Gör'

  return (
    <section
      aria-labelledby="latest-blog-heading"
      className="bg-background"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end" data-reveal>
          <div>
            <p className="eyebrow">Blog</p>
            <h2
              id="latest-blog-heading"
              className="text-display mt-5 max-w-3xl text-balance text-[2.1rem] text-foreground sm:text-5xl"
            >
              {isEnglish ? 'Latest from the Blog' : 'Blogdan Son Yazılar'}
            </h2>
            <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {isEnglish ? 'Explore current thinking on digital marketing, web technologies, brand management and sustainable digital growth.' : 'Dijital pazarlama, web teknolojileri, marka yönetimi ve işletmelerin dijital dünyada büyümesine yardımcı olacak güncel içeriklerimizi keşfedin.'}
            </p>
          </div>
          <Link href={href} className="group hidden h-12 items-center gap-2 rounded-lg border border-border px-5 text-sm font-semibold text-foreground transition-all duration-300 hover:border-foreground hover:bg-foreground hover:text-background lg:inline-flex">
            {allLabel}<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        {latestPosts.length > 0 ? (
          <div className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post, index) => <BlogCard key={post.slug} post={post} locale={locale} index={index} />)}
          </div>
        ) : (
          <p className="mt-12 rounded-2xl border border-dashed border-border bg-secondary/40 p-8 text-sm text-muted-foreground">
            {isEnglish ? 'New English articles will be published here soon.' : 'Yeni blog yazılarımız çok yakında burada olacak.'}
          </p>
        )}

        <div className="mt-12 flex justify-center lg:hidden">
          <Link href={href} className="group inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground">
            {allLabel}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
