import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { About } from '@/components/about'
import { WhyUs } from '@/components/why-us'
import { ContactCta } from '@/components/contact-cta'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({ title: 'Hakkımızda | Pars Medya', description: 'Pars Medya’nın yazılım mühendisliği, ürün tasarımı ve dijital stratejiyi birleştiren ekibini, çalışma yaklaşımını ve uluslararası bakışını tanıyın.', canonical: '/tr/hakkimizda', tr: '/tr/hakkimizda', en: '/en/about', locale: 'tr' })

export default function HakkimizdaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Hakkımızda"
        title="Markaların dijital gücünü ortaya çıkaran ekip"
        description="Bir panter kadar hızlı, bir o kadar da kararlı bir yaklaşımla fikirlerinizi ölçeklenebilir ve güvenli teknolojilere dönüştürüyoruz."
      />
      <About />
      <WhyUs />
      <ContactCta />
    </>
  )
}
