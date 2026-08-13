import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { ContactSection } from '@/components/contact-section'
import { localizedAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'İletişim | ParsMedya',
  description:
    'ParsMedya ile iletişime geçin. Projeniz için ücretsiz teklif alın; ekibimiz 24 saat içinde geri dönüş yapar.',
  alternates: localizedAlternates('/iletisim', '/iletisim', '/en/contact'),
}

export default function IletisimPage() {
  return (
    <>
      <PageHeader
        eyebrow="İletişim"
        title="Projenizi birlikte hayata geçirelim"
        description="Sorularınız veya proje talebiniz için formu doldurun ya da doğrudan bize ulaşın."
      />
      <ContactSection />
    </>
  )
}
