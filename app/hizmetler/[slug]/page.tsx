import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ServicePage } from '@/components/service-page/service-page'
import { toEnglishServiceSlug } from '@/lib/i18n'
import { createPageMetadata } from '@/lib/seo'
import { services, getService } from '@/lib/services'

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)
  if (!service) return { title: 'Hizmet Bulunamadı | ParsMedya' }
  const title = service.seoTitle ?? `${service.title} | Pars Medya`
  const description = service.seoDescription ?? service.description
  const canonical = `/hizmetler/${service.slug}`
  return createPageMetadata({
    title,
    description,
    canonical,
    tr: canonical,
    en: `/en/services/${toEnglishServiceSlug(service.slug)}`,
    locale: 'tr',
  })
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()
  return <ServicePage service={service} locale="tr" />
}
