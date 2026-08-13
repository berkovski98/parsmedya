import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarDays, UserRound } from 'lucide-react'
import { formatBlogDate, getPublishedPost, getPublishedPosts, getPublishedTranslation, parseContent } from '@/lib/blog'
import { BlogCard } from '@/components/blog-card'
import { localizedAlternates } from '@/lib/seo'

interface Props { params: Promise<{ slug: string }> }

export const revalidate = 300

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedPost(slug)
  if (!post) return { title: 'Blog Yazısı Bulunamadı | ParsMedya' }
  const title = post.seo_title || `${post.title} | ParsMedya`
  const description = post.seo_description || post.excerpt
  const image = post.image_url || '/parsmedya-hero.png'
  const translation = await getPublishedTranslation(post.translation_group_id, 'en')
  return {
    title, description,
    alternates: localizedAlternates(`/blog/${post.slug}`, `/blog/${post.slug}`, translation ? `/en/blog/${translation.slug}` : '/en/blog'),
    openGraph: { type: 'article', locale: 'tr_TR', title, description, url: `/blog/${post.slug}`, publishedTime: post.published_at || undefined, authors: [post.author], images: [{ url: image, alt: post.title }] },
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const post = await getPublishedPost(slug)
  if (!post) notFound()
  const related = (await getPublishedPosts()).filter((item) => item.slug !== slug).slice(0, 3)
  const image = post.image_url || '/parsmedya-hero.png'

  return (
    <article className="bg-background">
      <header className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 md:py-20">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Bloga Dön</Link>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-accent/10 px-3 py-1.5 font-semibold text-accent">{post.category}</span>
            <time dateTime={post.published_at || undefined} className="inline-flex items-center gap-1.5 text-muted-foreground"><CalendarDays className="h-4 w-4" />{formatBlogDate(post.published_at)}</time>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground"><UserRound className="h-4 w-4" />{post.author}</span>
          </div>
          <h1 className="mt-5 text-balance font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{post.title}</h1>
          <p className="mt-5 max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-secondary"><Image src={image} alt={post.title} fill priority sizes="(min-width: 1024px) 960px, 100vw" className="object-cover" /></div>
        <div className="mx-auto mt-12 max-w-3xl space-y-6 md:mt-16">
          {parseContent(post.content).map((block, index) => block.type === 'heading'
            ? <h2 key={`${block.text}-${index}`} className="pt-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{block.text}</h2>
            : <p key={`${block.text}-${index}`} className="whitespace-pre-line text-pretty text-base leading-8 text-muted-foreground sm:text-lg">{block.text}</p>)}
        </div>
      </div>
      {related.length > 0 && <aside aria-labelledby="related-posts" className="border-t border-border bg-secondary/40"><div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20"><h2 id="related-posts" className="font-display text-2xl font-bold text-foreground">İlgili Yazılar</h2><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{related.map((item) => <BlogCard key={item.id} post={item} />)}</div></div></aside>}
    </article>
  )
}
