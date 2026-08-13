import { Hero } from '@/components/hero'
import { Services } from '@/components/services'
import { LatestBlogPosts } from '@/components/latest-blog-posts'
import { WhyUs } from '@/components/why-us'
import { ContactCta } from '@/components/contact-cta'
import { localizedAlternates } from '@/lib/seo'

export const metadata: Metadata = { alternates: localizedAlternates('/', '/', '/en'), openGraph: { locale: 'tr_TR', url: '/' } }

export default function Home() {
  return (
    <>
      <Hero />
      <Services home />
      <WhyUs />
      <LatestBlogPosts />
      <ContactCta />
    </>
  )
}
import type { Metadata } from 'next'
