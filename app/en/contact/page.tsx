import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { EnglishContactSection } from '@/components/english-contact-section'
import { professionalServiceNode } from '@/lib/schema/organization'
import { createPageMetadata, safeJsonLd } from '@/lib/seo'
export const metadata: Metadata = createPageMetadata({ title: 'Contact Pars Medya | Discuss Your Software Project', description: 'Contact Pars Medya by WhatsApp, phone, email or the form to discuss custom software, web development, integrations or measurable digital growth with our team.', canonical: '/en/contact', tr: '/iletisim', en: '/en/contact', locale: 'en' })
export default function EnglishContactPage() { return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(professionalServiceNode('en')) }} /><PageHeader locale="en" path="/en/contact" eyebrow="Contact" title="Let’s build your next digital product" description="Tell us about your goals, operational challenges or product idea. We will return with a practical next step." /><EnglishContactSection /></> }
