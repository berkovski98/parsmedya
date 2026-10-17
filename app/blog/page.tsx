import type { Metadata } from 'next'
import { BlogCard } from '@/components/blog-card'
import { PageHeader } from '@/components/page-header'
import { getPublishedPosts } from '@/lib/blog'
import { createPageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  // The English listing is noindex while it has no posts, so it is only offered as hreflang once it does.
  const hasEnglishPosts = (await getPublishedPosts(1, 'en')).length > 0
  return createPageMetadata({
    title: 'Yazılım, SEO ve Dijital Pazarlama Blogu | Pars Medya',
    description: 'Yazılım geliştirme, dijital pazarlama, web teknolojileri, SEO ve marka yönetimi hakkında güncel ve uygulanabilir Pars Medya içeriklerini keşfedin.',
    canonical: '/blog',
    tr: '/blog',
    en: hasEnglishPosts ? '/en/blog' : null,
    locale: 'tr',
  })
}

export const revalidate = 60

export default async function BlogPage() {
  const posts = await getPublishedPosts()
  return (
    <>
      <PageHeader
        eyebrow="Blog"
        path="/blog"
        title="Yazılım ve Dijital Büyüme Blogu"
        description="Dijital dünyada doğru kararlar almanıza yardımcı olacak güncel bilgiler, uygulanabilir öneriler ve uzman görüşleri."
      />

      <section aria-label="Blog yazıları" className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
          {posts.length > 0 ? <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <BlogCard key={post.slug} post={post} index={index} />
            ))}
          </div> : <p className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">Henüz yayınlanmış bir blog yazısı bulunmuyor.</p>}
        </div>
      </section>
    </>
  )
}
