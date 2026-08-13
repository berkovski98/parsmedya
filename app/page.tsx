import { Hero } from '@/components/hero'
import { Services } from '@/components/services'
import { LatestBlogPosts } from '@/components/latest-blog-posts'
import { WhyUs } from '@/components/why-us'
import { ContactCta } from '@/components/contact-cta'
import { createPageMetadata } from '@/lib/seo'
import { ServicesSeoContent } from '@/components/home/services-seo-content'

export const metadata: Metadata = createPageMetadata({ title: 'Pars Medya | Web, Yazılım ve Dijital Dönüşüm', description: 'Web yazılım, özel yazılım, CRM, ERP, SaaS, e-ticaret ve dijital büyüme çözümleriyle işletmenizin süreçlerini güvenle dönüştürün.', canonical: '/', tr: '/', en: '/en', locale: 'tr' })

export default function Home() {
  return (
    <>
      <Hero />
      <Services home />
      <WhyUs />
      <LatestBlogPosts />
      <ServicesSeoContent />
      <ContactCta />
    </>
  )
}
import type { Metadata } from 'next'
