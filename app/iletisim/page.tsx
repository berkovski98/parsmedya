import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { ContactSection } from '@/components/contact-section'
import { professionalServiceNode } from '@/lib/schema/organization'
import { createPageMetadata, safeJsonLd } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({ title: 'İletişim ve Teklif Al | Pars Medya Yazılım Ajansı', description: 'Web, özel yazılım ve dijital dönüşüm projeniz için Pars Medya’ya WhatsApp, telefon, e-posta veya form ile ulaşın; ihtiyacınızı birlikte değerlendirelim.', canonical: '/iletisim', tr: '/iletisim', en: '/en/contact', locale: 'tr' })

export default function IletisimPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(professionalServiceNode('tr')) }} />
      <PageHeader
        eyebrow="İletişim"
        path="/iletisim"
        title="Projenizi birlikte hayata geçirelim"
        description="Sorularınız veya proje talebiniz için formu doldurun ya da doğrudan bize ulaşın."
      />
      <ContactSection />
    </>
  )
}
