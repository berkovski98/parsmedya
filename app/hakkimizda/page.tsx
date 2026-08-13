import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { About } from '@/components/about'
import { WhyUs } from '@/components/why-us'
import { ContactCta } from '@/components/contact-cta'
import { localizedAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Hakkımızda | ParsMedya',
  description:
    'ParsMedya; web, mobil ve kurumsal yazılım alanında uzmanlaşmış, güvenilir bir dijital çözüm ortağıdır. Misyonumuzu, vizyonumuzu ve yaklaşımımızı keşfedin.',
  alternates: localizedAlternates('/hakkimizda', '/hakkimizda', '/en/about'),
}

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
