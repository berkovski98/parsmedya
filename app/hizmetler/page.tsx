import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { Services } from '@/components/services'
import { Process } from '@/components/process'
import { ContactCta } from '@/components/contact-cta'

export const metadata: Metadata = {
  title: 'Hizmetlerimiz | ParsMedya',
  description:
    'Web sitesi geliştirme, mobil uygulama, e-ticaret, SEO, UI/UX tasarım ve yazılım danışmanlığı. Fikirden yayına uçtan uca dijital çözümler.',
}

export default function HizmetlerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Hizmetler"
        title="Uçtan uca dijital çözümler"
        description="Fikir aşamasından yayına kadar tüm süreçte yanınızdayız. İhtiyacınıza özel, ölçeklenebilir ve güvenilir çözümler sunuyoruz."
      />
      <Services />
      <Process />
      <ContactCta />
    </>
  )
}
