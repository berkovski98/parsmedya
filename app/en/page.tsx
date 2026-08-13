import type { Metadata } from 'next'
import { EnglishContactCta, EnglishHero, EnglishServices, EnglishWhyUs } from '@/components/english-sections'
import { LatestBlogPosts } from '@/components/latest-blog-posts'
import { localizedAlternates } from '@/lib/seo'

export const metadata: Metadata = { title: 'Pars Medya | Digital Agency & Software Development Company', description: 'Custom software, enterprise platforms, web development and measurable digital growth services for organizations operating in international markets.', alternates: localizedAlternates('/en', '/', '/en'), openGraph: { locale: 'en_US', title: 'Pars Medya | Digital Agency & Software Development Company', description: 'Software and digital solutions designed for sustainable business growth.', url: '/en' } }
export default function EnglishHomePage() { return <><EnglishHero /><EnglishServices /><EnglishWhyUs /><LatestBlogPosts locale="en" /><EnglishContactCta /></> }
