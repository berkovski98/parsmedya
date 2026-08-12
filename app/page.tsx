import { Hero } from '@/components/hero'
import { Services } from '@/components/services'
import { WhyUs } from '@/components/why-us'
import { ContactCta } from '@/components/contact-cta'

export default function Home() {
  return (
    <>
      <Hero />
      <Services home />
      <WhyUs />
      <ContactCta />
    </>
  )
}
