import assert from 'node:assert/strict'
import { test } from 'node:test'
import { EDI_COPY, EDI_PATHS } from '../lib/edi'
import { alternatePath } from '../lib/i18n'
import { services } from '../lib/services'
import { ENGLISH_STATIC_PATHS, TURKISH_STATIC_PATHS } from '../lib/sitemap-xml'

test('EDI landing pages pair across languages', () => {
  assert.equal(EDI_PATHS.tr, '/hizmetler/edi-entegrasyonu')
  assert.equal(EDI_PATHS.en, '/en/services/edi-integration')
  assert.equal(alternatePath(EDI_PATHS.tr), EDI_PATHS.en)
  assert.equal(alternatePath(EDI_PATHS.en), EDI_PATHS.tr)
})

test('EDI pages are in the static sitemaps but not in the local SEO service registry', () => {
  assert.ok((TURKISH_STATIC_PATHS as readonly string[]).includes(EDI_PATHS.tr))
  assert.ok((ENGLISH_STATIC_PATHS as readonly string[]).includes(EDI_PATHS.en))
  assert.equal(services.some((service) => service.slug === 'edi-entegrasyonu'), false)
})

test('EDI copy has matching structure in both languages and fits meta limits', () => {
  for (const locale of ['tr', 'en'] as const) {
    const copy = EDI_COPY[locale]
    assert.ok(copy.metaTitle.length <= 60, `${locale} title ${copy.metaTitle.length}`)
    assert.ok(copy.metaDescription.length <= 160, `${locale} description ${copy.metaDescription.length}`)
  }
  assert.equal(EDI_COPY.tr.messages.length, EDI_COPY.en.messages.length)
  assert.equal(EDI_COPY.tr.faqs.length, EDI_COPY.en.faqs.length)
  assert.equal(EDI_COPY.tr.capabilities.length, EDI_COPY.en.capabilities.length)
  assert.deepEqual(EDI_COPY.tr.messages.map((item) => item.code), EDI_COPY.en.messages.map((item) => item.code))
})
