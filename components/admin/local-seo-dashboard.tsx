'use client'

import { useMemo, useState } from 'react'
import { saveLocalSeoOverride } from '@/app/admin/actions'
import type { TurkeyCity } from '@/lib/locations/turkey'
import type { LocalSeoInventory } from '@/lib/local-seo/stats'
import type { LocalServiceRecord } from '@/lib/services/service-registry'

type Props = {
  inventory: LocalSeoInventory
  cities: Pick<TurkeyCity, 'name' | 'slug' | 'region' | 'districts'>[]
  services: Pick<LocalServiceRecord, 'title' | 'slug' | 'category'>[]
  message?: { type: 'success' | 'error'; text: string }
}

export function LocalSeoDashboard({ inventory, cities, services, message }: Props) {
  const [cityQuery, setCityQuery] = useState('')
  const [districtQuery, setDistrictQuery] = useState('')
  const [serviceQuery, setServiceQuery] = useState('')
  const [citySlug, setCitySlug] = useState('istanbul')
  const [districtSlug, setDistrictSlug] = useState('kadikoy')
  const [serviceSlug, setServiceSlug] = useState('ozel-yazilim-gelistirme')

  const filteredCities = useMemo(() => {
    const query = cityQuery.trim().toLocaleLowerCase('tr-TR')
    if (!query) return cities
    return cities.filter((city) => city.name.toLocaleLowerCase('tr-TR').includes(query) || city.slug.includes(query))
  }, [cities, cityQuery])

  const selectedCity = cities.find((city) => city.slug === citySlug) || cities[0]
  const filteredDistricts = useMemo(() => {
    const districts = selectedCity?.districts || []
    const query = districtQuery.trim().toLocaleLowerCase('tr-TR')
    if (!query) return districts
    return districts.filter((district) => district.name.toLocaleLowerCase('tr-TR').includes(query) || district.slug.includes(query))
  }, [districtQuery, selectedCity])

  const filteredServices = useMemo(() => {
    const query = serviceQuery.trim().toLocaleLowerCase('tr-TR')
    if (!query) return services
    return services.filter((service) => (
      service.title.toLocaleLowerCase('tr-TR').includes(query)
      || service.slug.includes(query)
      || service.category.toLocaleLowerCase('tr-TR').includes(query)
    ))
  }, [serviceQuery, services])

  const previewPath = districtSlug
    ? `/${citySlug}/${districtSlug}/${serviceSlug}`
    : `/${citySlug}/${serviceSlug}`

  const metrics = [
    { label: 'Toplam il', value: inventory.cities },
    { label: 'Toplam ilçe', value: inventory.districts },
    { label: 'Toplam hizmet', value: inventory.services },
    { label: 'İl hizmet sayfası', value: inventory.cityServicePages },
    { label: 'İlçe hizmet sayfası', value: inventory.districtServicePages },
    { label: 'Toplam local URL', value: inventory.totalLocalUrls },
  ]

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="font-display text-3xl font-bold">Local SEO</h1>
      <p className="mt-2 text-muted-foreground">
        Türkiye 81 il ve tüm resmi ilçeler için üretilen hizmet sayfalarını izleyin, önizleyin ve özel içerik girin.
      </p>
      {message ? (
        <p className={`mt-4 rounded-lg px-4 py-3 text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </p>
      ) : null}

      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((item) => (
          <div key={item.label} className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="mt-1 font-display text-2xl font-bold">{item.value.toLocaleString('tr-TR')}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-bold">Sayfa önizleme</h2>
          <label className="mt-5 block text-sm font-medium">Şehir ara</label>
          <input value={cityQuery} onChange={(event) => setCityQuery(event.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="İstanbul, Ankara..." />
          <select value={citySlug} onChange={(event) => { setCitySlug(event.target.value); setDistrictSlug('') }} className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
            {filteredCities.map((city) => (
              <option key={city.slug} value={city.slug}>{city.name} ({city.region})</option>
            ))}
          </select>

          <label className="mt-5 block text-sm font-medium">İlçe ara</label>
          <input value={districtQuery} onChange={(event) => setDistrictQuery(event.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Kadıköy, Çankaya..." />
          <select value={districtSlug} onChange={(event) => setDistrictSlug(event.target.value)} className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
            <option value="">İl sayfası (ilçe yok)</option>
            {filteredDistricts.map((district) => (
              <option key={district.slug} value={district.slug}>{district.name}</option>
            ))}
          </select>

          <label className="mt-5 block text-sm font-medium">Hizmet filtrele</label>
          <input value={serviceQuery} onChange={(event) => setServiceQuery(event.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="CRM, ERP, SEO..." />
          <select value={serviceSlug} onChange={(event) => setServiceSlug(event.target.value)} className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
            {filteredServices.map((service) => (
              <option key={service.slug} value={service.slug}>{service.title}</option>
            ))}
          </select>

          <a href={previewPath} target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">
            Sayfayı Gör
          </a>
          <p className="mt-3 break-all text-xs text-muted-foreground">{previewPath}</p>
        </div>

        <form action={saveLocalSeoOverride} className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-bold">İçerik override</h2>
          <p className="mt-2 text-sm text-muted-foreground">Boş bırakılan alanlarda varsayılan şablon kullanılır.</p>
          <input type="hidden" name="city_slug" value={citySlug} />
          <input type="hidden" name="district_slug" value={districtSlug} />
          <input type="hidden" name="service_slug" value={serviceSlug} />
          <label className="mt-5 block text-sm font-medium">SEO title</label>
          <input name="seo_title" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <label className="mt-4 block text-sm font-medium">Meta description</label>
          <textarea name="meta_description" rows={2} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <label className="mt-4 block text-sm font-medium">Hero başlığı</label>
          <input name="hero_title" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <label className="mt-4 block text-sm font-medium">Hero açıklaması</label>
          <textarea name="hero_description" rows={3} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <label className="mt-4 block text-sm font-medium">Hizmet özeti</label>
          <textarea name="intro" rows={3} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <label className="mt-4 block text-sm font-medium">Lokasyon girişi</label>
          <textarea name="location_intro" rows={3} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <label className="mt-4 block text-sm font-medium">SSS JSON</label>
          <textarea name="faq_json" rows={4} placeholder='[{"question":"...","answer":"..."}]' className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs" />
          <label className="mt-4 flex items-center gap-2 text-sm">
            <input type="checkbox" name="noindex" value="1" />
            Bu kombinasyonu noindex yap
          </label>
          <button type="submit" className="mt-6 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">
            Override kaydet
          </button>
        </form>
      </section>
    </div>
  )
}
