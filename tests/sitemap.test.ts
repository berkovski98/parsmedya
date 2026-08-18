import assert from 'node:assert/strict'
import { test } from 'node:test'
import robots from '../app/robots'
import { createPageMetadata } from '../lib/seo'
import {
  PRODUCTION_SITE_URL,
  canonicalAbsoluteUrl,
  resolveSiteUrl,
} from '../lib/site-url'
import {
  SITEMAP_INDEX_URLS,
  buildEnglishSitemapEntries,
  buildTurkishSitemapEntries,
  containsForbiddenHost,
  englishLocCount,
  hasTurkishRouteLeak,
  locUrls,
  turkishLocCount,
  unprefixedTurkishLocCount,
  urlset,
} from '../lib/sitemap-xml'

const now = new Date('2026-08-18T12:00:00.000Z')
const trPosts = [
  { slug: 'seo-nedir', status: 'published', locale: 'tr', updated_at: '2026-08-01T00:00:00.000Z' },
  { slug: 'taslak-yazi', status: 'draft', locale: 'tr', updated_at: '2026-08-02T00:00:00.000Z' },
  { slug: 'english-only', status: 'published', locale: 'en', updated_at: '2026-08-03T00:00:00.000Z' },
]
const enPosts = [
  { slug: 'what-is-seo', status: 'published', locale: 'en', updated_at: '2026-08-01T00:00:00.000Z' },
  { slug: 'draft-post', status: 'draft', locale: 'en', updated_at: '2026-08-02T00:00:00.000Z' },
  { slug: 'turkish-only', status: 'published', locale: 'tr', updated_at: '2026-08-03T00:00:00.000Z' },
]

test('production getSiteUrl ignores localhost env leftovers', () => {
  assert.equal(resolveSiteUrl('production', 'http://localhost:3000'), PRODUCTION_SITE_URL)
  assert.equal(resolveSiteUrl('production', 'http://127.0.0.1:3000'), PRODUCTION_SITE_URL)
  assert.equal(resolveSiteUrl('production', PRODUCTION_SITE_URL), PRODUCTION_SITE_URL)
  assert.equal(resolveSiteUrl('development', 'http://localhost:3000'), 'http://localhost:3000')
})

test('canonical sitemap URLs always use parsmedya.net', () => {
  assert.equal(canonicalAbsoluteUrl('/tr'), `${PRODUCTION_SITE_URL}/tr`)
  assert.equal(canonicalAbsoluteUrl('/tr/blog/ornek'), `${PRODUCTION_SITE_URL}/tr/blog/ornek`)
  assert.equal(canonicalAbsoluteUrl('/en/about'), `${PRODUCTION_SITE_URL}/en/about`)
})

test('Turkish sitemap contains only Turkish loc URLs', () => {
  const xml = urlset(buildTurkishSitemapEntries({
    posts: trPosts,
    serviceSlugs: ['web-sitesi-gelistirme'],
    now,
  }))
  const locs = locUrls(xml)
  assert.equal(containsForbiddenHost(xml), false)
  assert.equal(englishLocCount(xml), 0)
  assert.equal(unprefixedTurkishLocCount(xml), 0)
  assert.ok(turkishLocCount(xml) > 0)
  assert.equal(locs.includes(PRODUCTION_SITE_URL), false)
  assert.ok(locs.includes(`${PRODUCTION_SITE_URL}/tr`))
  assert.ok(locs.includes(`${PRODUCTION_SITE_URL}/tr/hakkimizda`))
  assert.ok(locs.includes(`${PRODUCTION_SITE_URL}/tr/vizyonumuz`))
  assert.ok(locs.includes(`${PRODUCTION_SITE_URL}/tr/misyonumuz`))
  assert.ok(locs.includes(`${PRODUCTION_SITE_URL}/tr/hizmetler`))
  assert.ok(locs.includes(`${PRODUCTION_SITE_URL}/tr/blog`))
  assert.ok(locs.includes(`${PRODUCTION_SITE_URL}/tr/blog/seo-nedir`))
  assert.ok(locs.includes(`${PRODUCTION_SITE_URL}/tr/hizmetler/web-sitesi-gelistirme`))
  assert.ok(locs.every((url) => url.startsWith(`${PRODUCTION_SITE_URL}/tr`)))
  assert.equal(locs.some((url) => url.includes('/en')), false)
  assert.equal(locs.includes(`${PRODUCTION_SITE_URL}/tr/blog/taslak-yazi`), false)
  assert.equal(locs.includes(`${PRODUCTION_SITE_URL}/tr/blog/english-only`), false)
  assert.equal(locs.includes(`${PRODUCTION_SITE_URL}/en/blog/english-only`), false)
  assert.equal(locs.includes(`${PRODUCTION_SITE_URL}/blog/seo-nedir`), false)
  assert.equal(locs.includes(`${PRODUCTION_SITE_URL}/hizmetler`), false)
})

test('English sitemap contains only English loc URLs', () => {
  const xml = urlset(buildEnglishSitemapEntries({
    posts: enPosts,
    serviceSlugs: ['website-development'],
    now,
  }))
  const locs = locUrls(xml)
  assert.equal(containsForbiddenHost(xml), false)
  assert.ok(englishLocCount(xml) > 0)
  assert.equal(turkishLocCount(xml), 0)
  assert.equal(unprefixedTurkishLocCount(xml), 0)
  assert.equal(hasTurkishRouteLeak(xml), false)
  assert.ok(locs.includes(`${PRODUCTION_SITE_URL}/en`))
  assert.ok(locs.includes(`${PRODUCTION_SITE_URL}/en/about`))
  assert.ok(locs.includes(`${PRODUCTION_SITE_URL}/en/blog`))
  assert.ok(locs.includes(`${PRODUCTION_SITE_URL}/en/blog/what-is-seo`))
  assert.ok(locs.includes(`${PRODUCTION_SITE_URL}/en/services/website-development`))
  assert.equal(locs.includes(`${PRODUCTION_SITE_URL}/en/blog/draft-post`), false)
  assert.equal(locs.includes(`${PRODUCTION_SITE_URL}/blog/turkish-only`), false)
  assert.equal(locs.some((url) => url.includes('/hakkimizda') || url.includes('/hizmetler') || url.includes('/iletisim')), false)
  assert.ok(locs.every((url) => url.startsWith(`${PRODUCTION_SITE_URL}/en`)))
})

test('robots.txt lists both language sitemaps on the canonical host', () => {
  const document = robots()
  assert.deepEqual(document.sitemap, [...SITEMAP_INDEX_URLS])
  assert.ok(document.sitemap.includes(`${PRODUCTION_SITE_URL}/sitemap.xml`))
  assert.ok(document.sitemap.includes(`${PRODUCTION_SITE_URL}/sitemap-en.xml`))
  assert.equal(containsForbiddenHost(document.sitemap.join('\n')), false)
})

test('hreflang alternates stay on the canonical host and default to Turkish', () => {
  const metadata = createPageMetadata({
    title: 'Pars Medya',
    description: 'Test',
    canonical: '/tr',
    tr: '/tr',
    en: '/en',
    locale: 'tr',
  })
  assert.equal(metadata.alternates?.canonical, `${PRODUCTION_SITE_URL}/tr`)
  assert.deepEqual(metadata.alternates?.languages, {
    tr: `${PRODUCTION_SITE_URL}/tr`,
    en: `${PRODUCTION_SITE_URL}/en`,
    'x-default': `${PRODUCTION_SITE_URL}/tr`,
  })
  assert.equal(metadata.openGraph?.url, `${PRODUCTION_SITE_URL}/tr`)
})
