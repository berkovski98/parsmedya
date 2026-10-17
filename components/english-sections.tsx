import { ContactCta } from '@/components/contact-cta'
import { Hero } from '@/components/hero'
import { Services } from '@/components/services'
import { WhyUs } from '@/components/why-us'

export function EnglishHero() {
  return <Hero locale="en" />
}

export function EnglishServices({ all = false }: { all?: boolean }) {
  return <Services locale="en" all={all} />
}

export function EnglishWhyUs() {
  return <WhyUs locale="en" />
}

export function EnglishContactCta() {
  return <ContactCta locale="en" />
}
