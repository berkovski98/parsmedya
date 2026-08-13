import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { EnglishContactCta, EnglishServices } from '@/components/english-sections'
import { localizedAlternates } from '@/lib/seo'
export const metadata: Metadata = { title: 'Software & Digital Services | Pars Medya', description: 'Explore custom software, CRM, ERP, SaaS, integrations, e-commerce, mobile and digital growth services.', alternates: localizedAlternates('/en/services', '/hizmetler', '/en/services') }
export default function EnglishServicesPage() { return <><PageHeader locale="en" eyebrow="Services" title="Software and digital solutions for ambitious organizations" description="From enterprise applications and integrations to customer experiences and digital growth, every solution is planned around your goals." /><EnglishServices all /><EnglishContactCta /></> }
