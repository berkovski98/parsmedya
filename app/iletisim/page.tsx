import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { ContactSection } from '@/components/contact-section'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({ title: 'İletişim | Pars Medya', description: 'Web, özel yazılım ve dijital dönüşüm projenizi görüşmek için Pars Medya ile iletişime geçin; ihtiyaçlarınızı birlikte değerlendirelim.', canonical: '/iletisim', tr: '/iletisim', en: '/en/contact', locale: 'tr' })

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
