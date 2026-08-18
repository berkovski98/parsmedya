import { getServicePageExtras } from '@/lib/service-page-copy'
import { getServiceCategory, services, type Service, type ServiceCategory } from '@/lib/services'

export type LocalServiceRecord = {
  id: string
  category: ServiceCategory
  title: string
  slug: string
  shortDescription: string
  description: string
  keywords: string[]
  icon: Service['icon']
  seoTitleTemplate: string
  seoDescriptionTemplate: string
  source: Service
}

function keywordsFor(service: Service) {
  const fromFeatures = service.features.map((feature) => feature.title)
  const fromUseCases = (service.useCases || []).map((item) => item.title)
  return [...new Set([service.title, service.category, ...fromFeatures, ...fromUseCases].filter(Boolean) as string[])]
}

export function getLocalServiceRegistry(): LocalServiceRecord[] {
  return services.map((service) => ({
    id: service.slug,
    category: getServiceCategory(service),
    title: service.title,
    slug: service.slug,
    shortDescription: service.description,
    description: service.intro || service.description,
    keywords: keywordsFor(service),
    icon: service.icon,
    seoTitleTemplate: `{location} ${service.title} | Pars Medya`,
    seoDescriptionTemplate: `{location} ${service.title.toLocaleLowerCase('tr-TR')} hizmetleriyle işletmenize özel yazılım ve dijital çözümler geliştirin. Pars Medya ile projenizi planlayın.`,
    source: service,
  }))
}

const registry = getLocalServiceRegistry()
const bySlug = new Map(registry.map((service) => [service.slug, service]))

export function getLocalServices() {
  return registry
}

export function getLocalService(slug: string) {
  return bySlug.get(slug) ?? null
}

export function getRelatedLocalServices(slug: string, limit = 4) {
  const current = getLocalService(slug)
  if (!current) return []
  const related = (current.source.relatedSlugs || [])
    .map((item) => getLocalService(item))
    .filter((item): item is LocalServiceRecord => item !== null && item.slug !== slug)
  if (related.length >= limit) return related.slice(0, limit)
  const sameCategory = registry.filter((item) => item.category === current.category && item.slug !== slug)
  const merged = [...related]
  for (const item of sameCategory) {
    if (merged.length >= limit) break
    if (!merged.some((entry) => entry.slug === item.slug)) merged.push(item)
  }
  return merged.slice(0, limit)
}

export function getLocalServiceVisual(slug: string) {
  return getServicePageExtras(slug).visual
}

export function getLocalServicesByCategory() {
  const groups = new Map<ServiceCategory, LocalServiceRecord[]>()
  for (const service of registry) {
    const list = groups.get(service.category) || []
    list.push(service)
    groups.set(service.category, list)
  }
  return groups
}
