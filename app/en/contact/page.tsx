import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { EnglishContactSection } from '@/components/english-contact-section'
import { localizedAlternates } from '@/lib/seo'
export const metadata: Metadata = { title: 'Contact Pars Medya | Discuss Your Project', description: 'Contact Pars Medya to discuss custom software, web development and digital growth opportunities.', alternates: localizedAlternates('/en/contact', '/iletisim', '/en/contact') }
export default function EnglishContactPage() { return <><PageHeader locale="en" eyebrow="Contact" title="Let’s build your next digital product" description="Tell us about your goals, operational challenges or product idea. We will return with a practical next step." /><EnglishContactSection /></> }
