import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ServicePage } from '@/components/service-page/service-page'
import { createPageMetadata } from '@/lib/seo'
import { englishServices, getEnglishService } from '@/lib/services-en'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return englishServices.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getEnglishService((await params).slug)
  if (!service) return { title: 'Service Not Found | Pars Medya' }
  const canonical = `/en/services/${service.slug}`
  const tr = `/hizmetler/${service.trSlug}`
  return createPageMetadata({
    title: service.seoTitle || `${service.title} | Pars Medya`,
    description: service.seoDescription || service.description,
    canonical,
    tr,
    en: canonical,
    locale: 'en',
  })
}

export default async function EnglishServiceDetail({ params }: Props) {
  const service = getEnglishService((await params).slug)
  if (!service) notFound()
  return <ServicePage service={service} locale="en" />
}
