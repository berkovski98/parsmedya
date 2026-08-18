import { LocalSeoDashboard } from '@/components/admin/local-seo-dashboard'
import { getTurkeyCities } from '@/lib/locations/turkey'
import { getLocalSeoInventory } from '@/lib/local-seo/stats'
import { getLocalServices } from '@/lib/services/service-registry'

export default async function LocalSeoAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const params = await searchParams
  const message = params.success
    ? { type: 'success' as const, text: params.success }
    : params.error
      ? { type: 'error' as const, text: params.error }
      : undefined
  return (
    <LocalSeoDashboard
      inventory={getLocalSeoInventory()}
      cities={getTurkeyCities().map((city) => ({
        name: city.name,
        slug: city.slug,
        region: city.region,
        districts: city.districts,
      }))}
      services={getLocalServices().map((service) => ({
        title: service.title,
        slug: service.slug,
        category: service.category,
      }))}
      message={message}
    />
  )
}
