import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarDays, UserRound } from 'lucide-react'
import { extractFaqs, formatBlogDate, getPublishedPost, getPublishedPosts, getPublishedTranslation, parseContent } from '@/lib/blog'
import { BlogCard } from '@/components/blog-card'
import { BlogContent } from '@/components/blog-content'
import { BlogCoverImage } from '@/components/blog-cover-image'
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
      <header className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 md:py-20">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Ana Sayfa</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog" className="hover:text-foreground">Blog</Link>
            <span aria-hidden="true">/</span>
            <span className="text-foreground">{post.title}</span>
          </nav>
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
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-secondary"><BlogCoverImage src={image} alt={post.title} priority sizes="(min-width: 1024px) 960px, 100vw" className="object-cover" /></div>
        <BlogContent blocks={blocks} />
        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-border bg-secondary/40 p-6 sm:p-8">
          <p className="font-display text-xl font-bold text-foreground">Projenizi konuşalım</p>
          <p className="mt-2 text-muted-foreground">Kapsamı netleştirmek ve teknik yaklaşımı birlikte değerlendirmek için kısa bir görüşme planlayabilirsiniz.</p>
          <Link href="/iletisim" className="mt-5 inline-flex rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90">İletişime Geçin</Link>
        </div>
      </div>
      {related.length > 0 && (
        <aside aria-labelledby="related-posts" className="border-t border-border bg-secondary/40">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
            <h2 id="related-posts" className="font-display text-2xl font-bold text-foreground">İlgili Yazılar</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{related.map((item) => <BlogCard key={item.id} post={item} />)}</div>
          </div>
        </aside>
      )}
    </article>
  )
}
