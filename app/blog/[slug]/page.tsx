import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarDays, UserRound } from 'lucide-react'
import { extractFaqs, formatBlogDate, getPublishedPost, getPublishedPosts, getPublishedTranslation, parseContent } from '@/lib/blog'
import { BlogCard } from '@/components/blog-card'
import { BlogContent } from '@/components/blog-content'
import { BlogCoverImage } from '@/components/blog-cover-image'
import { BlogArticleCta, ReadingProgress } from '@/components/blog-article-cta'
import { resolveBlogImageSrc } from '@/lib/blog-image'
import { absoluteAlternates, createPageMetadata, safeJsonLd } from '@/lib/seo'
import { absoluteUrl, getSiteUrl } from '@/lib/site-url'

interface Props { params: Promise<{ slug: string }> }

export const revalidate = 60

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedPost(slug)
  if (!post) return { title: 'Blog Yazısı Bulunamadı | ParsMedya' }
  const title = post.seo_title || `${post.title} | ParsMedya`
  const description = post.seo_description || post.excerpt
  const image = resolveBlogImageSrc(post.image_url)
  const translation = await getPublishedTranslation(post.translation_group_id, 'en')
  const canonical = `/blog/${post.slug}`
  const enPath = translation ? `/en/blog/${translation.slug}` : '/en/blog'
  const metadata = createPageMetadata({ title, description, canonical, tr: canonical, en: enPath, locale: 'tr', image, type: 'article' })
  return {
    ...metadata,
    alternates: absoluteAlternates(canonical, { tr: canonical, en: enPath, 'x-default': canonical }),
    openGraph: {
      type: 'article',
      locale: 'tr_TR',
      title,
      description,
      url: absoluteUrl(canonical),
      images: [{ url: image, alt: post.title }],
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at,
      authors: [post.author],
    },
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const post = await getPublishedPost(slug)
  if (!post) notFound()
  const related = (await getPublishedPosts()).filter((item) => item.slug !== slug).slice(0, 3)
  const image = resolveBlogImageSrc(post.image_url)
  const canonical = absoluteUrl(`/blog/${post.slug}`)
  const blocks = parseContent(post.content)
  const faqs = extractFaqs(post.content)

  const breadcrumbLd = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: absoluteUrl('/blog') },
      { '@type': 'ListItem', position: 3, name: post.title, item: canonical },
    ],
  }

  const articleLd = {
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seo_description || post.excerpt,
    image: [new URL(image, getSiteUrl()).toString()],
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: 'Pars Medya', url: getSiteUrl() },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    inLanguage: 'tr-TR',
  }

  const graph: unknown[] = [articleLd, breadcrumbLd]
  if (faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    })
  }

  return (
    <article className="bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ '@context': 'https://schema.org', '@graph': graph }) }} />
      <ReadingProgress />
      <header className="relative isolate overflow-hidden bg-ink pb-32 text-ink-foreground md:pb-40">
        <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 bg-right-top text-white [mask-image:radial-gradient(ellipse_70%_100%_at_85%_0%,#000_10%,transparent_70%)]" />
        <div className="mx-auto max-w-4xl px-4 pt-12 sm:px-6 md:pt-16">
          <nav aria-label="Breadcrumb" className="intro mb-6 flex flex-wrap items-center gap-2 text-sm text-white/55">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">{post.title}</span>
          </nav>
          <Link href="/blog" className="group inline-flex items-center gap-1.5 text-sm font-medium text-white/60 hover:text-white"><ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />Bloga Dön</Link>
          <div className="intro mt-8 flex flex-wrap items-center gap-3 text-sm" style={{ '--i': 1 } as React.CSSProperties}>
            <span className="rounded-full bg-accent/15 px-3 py-1.5 font-semibold text-accent">{post.category}</span>
            <time dateTime={post.published_at || undefined} className="inline-flex items-center gap-1.5 text-white/60"><CalendarDays className="h-4 w-4" />{formatBlogDate(post.published_at)}</time>
            <span className="inline-flex items-center gap-1.5 text-white/60"><UserRound className="h-4 w-4" />{post.author}</span>
          </div>
          <h1 className="text-display mt-6 text-balance text-4xl text-white sm:text-[3.25rem]"><span className="hero-line"><span>{post.title}</span></span></h1>
          <p className="intro mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-white/70" style={{ '--i': 2 } as React.CSSProperties}>{post.excerpt}</p>
        </div>
      </header>
      <div className="mx-auto -mt-24 max-w-5xl px-4 pb-12 sm:px-6 md:-mt-32 md:pb-16">
        <div className="intro-fade relative aspect-[16/9] overflow-hidden rounded-2xl bg-secondary shadow-[0_40px_80px_-40px_rgb(10_20_50/0.6)]"><BlogCoverImage src={image} alt={post.title} priority sizes="(min-width: 1024px) 960px, 100vw" className="object-cover" /></div>
        <BlogContent blocks={blocks} />
        <BlogArticleCta locale="tr" />
      </div>
      {related.length > 0 && (
        <aside aria-labelledby="related-posts" className="border-t border-border bg-secondary/40">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
            <h2 id="related-posts" className="font-display text-2xl font-bold text-foreground">İlgili Yazılar</h2>
            <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{related.map((item, index) => <BlogCard key={item.id} post={item} index={index} />)}</div>
          </div>
        </aside>
      )}
    </article>
  )
}
