import assert from 'node:assert/strict'
import { test } from 'node:test'
import { toEnglishServiceSlug, toTurkishServiceSlug } from '../lib/i18n'
import { SERVICE_PAGE_EXTRAS, getServicePageExtras } from '../lib/service-page-copy'
import { SERVICE_UI, buildServicePageModel, serviceHighlights, turkishServiceSlug } from '../lib/service-page'
import { services } from '../lib/services'
import { englishServices } from '../lib/services-en'

const TURKISH_LEAK = /Hizmete genel bakış|Neler geliştiriyoruz|Nasıl çalışıyoruz|İhtiyacınıza Göre|Sık sorulan sorular|Neden Pars Medya/

function englishStrings(value: unknown, acc: string[] = []): string[] {
  if (typeof value === 'string') return acc
  if (Array.isArray(value)) {
    for (const item of value) englishStrings(item, acc)
    return acc
  }
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    if ('tr' in record && 'en' in record && typeof record.en === 'string') {
      acc.push(record.en)
      return acc
    }
    for (const nested of Object.values(record)) englishStrings(nested, acc)
  }
  return acc
}

test('every Turkish service has extras and an English pair', () => {
  assert.equal(services.length, 22)
  assert.equal(englishServices.length, 22)
  assert.equal(Object.keys(SERVICE_PAGE_EXTRAS).length, 22)

  for (const service of services) {
    assert.equal(service.slug in SERVICE_PAGE_EXTRAS, true, `missing extras for ${service.slug}`)
    const enSlug = toEnglishServiceSlug(service.slug)
    assert.ok(enSlug, `missing English slug for ${service.slug}`)
    assert.equal(toTurkishServiceSlug(enSlug), service.slug)
    const extras = getServicePageExtras(service.slug)
    assert.equal(extras, SERVICE_PAGE_EXTRAS[service.slug])
    assert.equal(extras.trust.length, 4)
    assert.equal(extras.overviewSteps.length, 5)
    assert.equal(extras.architecture.layers.length, 5)
    assert.ok(extras.architecture.sides.length >= 4 && extras.architecture.sides.length <= 6)
    assert.equal(extras.why.length, 5)
    assert.equal(extras.outcomes.length, 6)
    assert.equal(extras.process.length, 6)
  }
})

test('English extras and UI copy do not leak Turkish section headings', () => {
  for (const value of Object.values(SERVICE_UI.en)) {
    assert.equal(TURKISH_LEAK.test(value), false, value)
  }
  for (const extras of Object.values(SERVICE_PAGE_EXTRAS)) {
    for (const text of englishStrings(extras)) {
      assert.equal(TURKISH_LEAK.test(text), false, text)
    }
  }
})

test('service page models keep locale-specific titles and paired routes', () => {
  const tr = services.find((service) => service.slug === 'ozel-yazilim-gelistirme')
  const en = englishServices.find((service) => service.trSlug === 'ozel-yazilim-gelistirme')
  assert.ok(tr)
  assert.ok(en)
  const trModel = buildServicePageModel(tr, 'tr')
  const enModel = buildServicePageModel(en, 'en')
  assert.equal(trModel.title, 'Özel Yazılım Geliştirme')
  assert.equal(enModel.title, 'Custom Software Development')
  assert.equal(trModel.canonical, '/hizmetler/ozel-yazilim-gelistirme')
  assert.equal(enModel.canonical, '/en/services/custom-software-development')
  assert.equal(trModel.enPath, enModel.canonical)
  assert.equal(enModel.trPath, trModel.canonical)
  assert.equal(turkishServiceSlug(en), 'ozel-yazilim-gelistirme')
  assert.equal(trModel.visual, 'software')
  assert.equal(enModel.visual, 'software')
  const enHighlights = serviceHighlights(en, 'en').join(' ')
  assert.equal(/İşletmenizin|Gereksiz modül/.test(enHighlights), false)
  assert.match(enHighlights, /manual work|operational data|visibility/i)
})

test('service-specific extras stay distinct for core categories', () => {
  const crm = getServicePageExtras('crm-yazilim-cozumleri')
  const erp = getServicePageExtras('erp-yazilim-cozumleri')
  const api = getServicePageExtras('api-sistem-entegrasyonlari')
  const commerce = getServicePageExtras('e-ticaret-yazilimi')
  const ai = getServicePageExtras('yapay-zeka-destekli-yazilim')
  const seo = getServicePageExtras('seo-dijital-pazarlama')

  assert.equal(crm.visual, 'crm')
  assert.match(crm.trust[0].title.tr, /pipeline|lead|satış/i)
  assert.match(erp.trust.map((item) => item.title.tr).join(' '), /stok|finans|satın|operasyon/i)
  assert.match(api.trust.map((item) => item.title.en).join(' '), /API|webhook|sync|REST/i)
  assert.match(commerce.trust.map((item) => item.title.tr).join(' '), /sipariş|ödeme|stok|ürün|kargo/i)
  assert.match(ai.ctaText.en, /LLM|classif|document|AI/i)
  assert.equal(seo.visual, 'seo')
  assert.notEqual(crm.ctaTitle.tr, erp.ctaTitle.tr)
  assert.notEqual(api.ctaTitle.en, commerce.ctaTitle.en)
})
