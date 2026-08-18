import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { EnglishContactCta, EnglishServices } from '@/components/english-sections'
import { createPageMetadata } from '@/lib/seo'
export const metadata: Metadata = createPageMetadata({ title: 'Software & Digital Services | Pars Medya', description: 'Explore custom software, CRM, ERP, SaaS, system integrations, e-commerce, mobile products and measurable digital growth services.', canonical: '/en/services', tr: '/tr/hizmetler', en: '/en/services', locale: 'en' })
export default function EnglishServicesPage() { return <><PageHeader locale="en" eyebrow="Services" title="Software and digital solutions for ambitious organizations" description="From enterprise applications and integrations to customer experiences and digital growth, every solution is planned around your goals." /><EnglishServices all /><EnglishContactCta /></> }
