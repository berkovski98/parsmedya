import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { BlogCard } from '@/components/blog-card'
import { getPublishedPosts } from '@/lib/blog'
import { createPageMetadata } from '@/lib/seo'

export const revalidate = 60
export const metadata: Metadata = createPageMetadata({ title: 'Insights | Pars Medya Blog', description: 'Read practical insights on software development, digital products, technology strategy, marketing and sustainable business growth.', canonical: '/en/blog', tr: '/blog', en: '/en/blog', locale: 'en' })
export default async function EnglishBlogPage() { const posts = await getPublishedPosts(undefined, 'en'); return <><PageHeader locale="en" eyebrow="Insights" title="Pars Medya Blog" description="Practical thinking on software, digital products, marketing and sustainable growth." /><section className="bg-background"><div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">{posts.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{posts.map((post) => <BlogCard key={post.id} post={post} locale="en" />)}</div> : <p className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">English articles will be published here soon.</p>}</div></section></> }
