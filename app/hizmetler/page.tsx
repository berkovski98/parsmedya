import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { Services } from '@/components/services'
import { Process } from '@/components/process'
import { ContactCta } from '@/components/contact-cta'
import { localizedAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Hizmetlerimiz | ParsMedya',
  description:
    'Web yazılım, özel yazılım, CRM, ERP, e-ticaret, SaaS, entegrasyon ve dijital büyüme hizmetleriyle işletmenize özel uçtan uca çözümler.',
  alternates: localizedAlternates('/hizmetler', '/hizmetler', '/en/services'),
}

export default function HizmetlerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Hizmetler"
        title="İşletmenizi büyüten yazılım ve dijital çözümler"
        description="Web uygulamalarından CRM ve ERP sistemlerine, entegrasyondan dijital büyümeye kadar ihtiyaçlarınıza özel, güvenli ve ölçeklenebilir çözümler geliştiriyoruz."
      />
      <Services />
      <Process />
      <ContactCta />
    </>
  )
}
