import { cache } from 'react'
import { createClient } from '@supabase/supabase-js'
import { hasSupabaseConfig, getSupabaseConfig } from '@/lib/supabase/config'
import { emptyOverrideSets, hasCustomLocalContent, type LocalIndexOverrideSets } from '@/lib/local-seo/index-policy'
import { overrideKey, type LocalSeoOverride } from '@/lib/local-seo/types'

function publicClient() {
  const { url, anonKey } = getSupabaseConfig()
  return createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } })
}

function mapRow(row: Record<string, unknown>): LocalSeoOverride {
  return {
    locale: String(row.locale || 'tr'),
    city_slug: String(row.city_slug || ''),
    district_slug: row.district_slug ? String(row.district_slug) : null,
    service_slug: String(row.service_slug || ''),
    seo_title: row.seo_title ? String(row.seo_title) : null,
    meta_description: row.meta_description ? String(row.meta_description) : null,
    hero_title: row.hero_title ? String(row.hero_title) : null,
    hero_description: row.hero_description ? String(row.hero_description) : null,
    content_json: (row.content_json as LocalSeoOverride['content_json']) || null,
    faq_json: Array.isArray(row.faq_json) ? (row.faq_json as LocalSeoOverride['faq_json']) : null,
    is_indexable: row.is_indexable !== false,
  }
}

/** Cached per request so metadata and page share one query. */
export const getLocalSeoOverride = cache(async (city: string, district: string | null, service: string) => {
  if (!hasSupabaseConfig()) return null
  try {
    const supabase = publicClient()
    const { data, error } = await supabase
      .from('local_seo_overrides')
      .select('*')
      .eq('locale', 'tr')
      .eq('city_slug', city)
      .eq('service_slug', service)
      .eq('district_slug', district || '')
      .maybeSingle()
    if (error || !data) return null
    return mapRow(data)
  } catch {
    return null
  }
})

function overridePath(row: Record<string, unknown>) {
  const city = String(row.city_slug || '')
  const service = String(row.service_slug || '')
  if (!city || !service) return null
  const district = row.district_slug ? String(row.district_slug) : ''
  return district ? `/${city}/${district}/${service}` : `/${city}/${service}`
}

/**
 * Turkish override rows that change the default index decision of the local index policy:
 * `excluded` = switched to noindex, `promoted` = indexable rows that add their own copy.
 * English pages read the same sets through their Turkish counterpart.
 */
export async function getLocalIndexOverrideSets(): Promise<LocalIndexOverrideSets> {
  const sets = emptyOverrideSets()
  if (!hasSupabaseConfig()) return sets
  try {
    const { data, error } = await publicClient()
      .from('local_seo_overrides')
      .select('city_slug,district_slug,service_slug,is_indexable,content_json,faq_json')
      .eq('locale', 'tr')
    if (error || !data) return sets
    for (const row of data) {
      const path = overridePath(row)
      if (!path) continue
      const override = mapRow(row)
      if (override.is_indexable === false) sets.excluded.add(path)
      else if (hasCustomLocalContent(override)) sets.promoted.add(path)
    }
    return sets
  } catch {
    return sets
  }
}

/** @deprecated use getLocalIndexOverrideSets */
export async function getNonIndexableLocalPaths() {
  return (await getLocalIndexOverrideSets()).excluded
}

export { overrideKey }
