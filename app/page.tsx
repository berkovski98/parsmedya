import { Hero } from '@/components/hero'
import { Services } from '@/components/services'
import { LatestBlogPosts } from '@/components/latest-blog-posts'
import { WhyUs } from '@/components/why-us'
import { ContactCta } from '@/components/contact-cta'

export default function Home() {
  return (
    <>
      <Hero />
      <Services home />
      <WhyUs />
      <LatestBlogPosts />
      <ContactCta />
    </>
  )
}
