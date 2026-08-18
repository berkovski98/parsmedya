import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { EnglishContactSection } from '@/components/english-contact-section'
import { createPageMetadata } from '@/lib/seo'
export const metadata: Metadata = createPageMetadata({ title: 'Contact Pars Medya | Discuss Your Project', description: 'Contact Pars Medya to discuss a custom software, web development, integration or measurable digital growth opportunity with our team.', canonical: '/en/contact', tr: '/tr/iletisim', en: '/en/contact', locale: 'en' })
export default function EnglishContactPage() { return <><PageHeader locale="en" eyebrow="Contact" title="Let’s build your next digital product" description="Tell us about your goals, operational challenges or product idea. We will return with a practical next step." /><EnglishContactSection /></> }
