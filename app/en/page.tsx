import type { Metadata } from 'next'
import { EnglishContactCta, EnglishHero, EnglishServices, EnglishWhyUs } from '@/components/english-sections'
import { LatestBlogPosts } from '@/components/latest-blog-posts'
import { createPageMetadata } from '@/lib/seo'
import { ServicesSeoContent } from '@/components/home/services-seo-content'
import { EdiSpotlight } from '@/components/edi/edi-spotlight'
import { HomeMarkets } from '@/components/home/markets'
import { HomeFaq } from '@/components/home/home-faq'
import { Process } from '@/components/process'

export const metadata: Metadata = createPageMetadata({ title: 'Pars Medya | Software Development & Digital Transformation', description: 'Custom software, enterprise platforms, web development and measurable digital growth solutions for organizations operating across international markets.', canonical: '/en', tr: '/', en: '/en', locale: 'en' })

export default function EnglishHomePage() {
  return (
    <>
      <EnglishHero />
      <EnglishServices />
      <EdiSpotlight locale="en" />
      <EnglishWhyUs />
      <Process locale="en" />
      <ServicesSeoContent locale="en" />
      <HomeMarkets locale="en" />
      <HomeFaq locale="en" />
      <LatestBlogPosts locale="en" />
      <EnglishContactCta />
    </>
  )
}
