import assert from 'node:assert/strict'
import { test } from 'node:test'
import { alternatePath, localeHomePath, paths } from '../lib/i18n'
import { LEGACY_TR_REDIRECTS } from '../lib/locale-redirects.mjs'

test('locale homes are prefixed', () => {
  assert.equal(localeHomePath('tr'), '/tr')
  assert.equal(localeHomePath('en'), '/en')
  assert.equal(paths.about('tr'), '/tr/hakkimizda')
  assert.equal(paths.about('en'), '/en/about')
  assert.equal(paths.blogPost('tr', 'foo'), '/tr/blog/foo')
  assert.equal(paths.blogPost('en', 'foo-en'), '/en/blog/foo-en')
})

test('language switch maps paired public pages', () => {
  assert.equal(alternatePath('/tr'), '/en')
  assert.equal(alternatePath('/en'), '/tr')
  assert.equal(alternatePath('/tr/hakkimizda'), '/en/about')
  assert.equal(alternatePath('/en/about'), '/tr/hakkimizda')
  assert.equal(alternatePath('/tr/hizmetler/ozel-yazilim-gelistirme'), '/en/services/custom-software-development')
  assert.equal(alternatePath('/en/services/custom-software-development'), '/tr/hizmetler/ozel-yazilim-gelistirme')
  assert.equal(alternatePath('/tr/blog/foo'), '/en/blog')
  assert.equal(alternatePath('/en/blog/foo-en'), '/tr/blog')
  assert.equal(alternatePath('/hakkimizda'), '/en/about')
})

test('legacy unprefixed Turkish URLs permanently redirect under /tr', () => {
  const map = Object.fromEntries(LEGACY_TR_REDIRECTS.map((rule) => [rule.source, rule]))
  assert.equal(map['/'].destination, '/tr')
  assert.equal(map['/hakkimizda'].destination, '/tr/hakkimizda')
  assert.equal(map['/vizyonumuz'].destination, '/tr/vizyonumuz')
  assert.equal(map['/misyonumuz'].destination, '/tr/misyonumuz')
  assert.equal(map['/vizyon'].destination, '/tr/vizyonumuz')
  assert.equal(map['/misyon'].destination, '/tr/misyonumuz')
  assert.equal(map['/hizmetler'].destination, '/tr/hizmetler')
  assert.equal(map['/hizmetler/:slug'].destination, '/tr/hizmetler/:slug')
  assert.equal(map['/blog'].destination, '/tr/blog')
  assert.equal(map['/blog/:slug'].destination, '/tr/blog/:slug')
  assert.equal(map['/iletisim'].destination, '/tr/iletisim')
  assert.ok(LEGACY_TR_REDIRECTS.every((rule) => rule.permanent === true))
  assert.equal(LEGACY_TR_REDIRECTS.some((rule) => rule.source.startsWith('/admin') || rule.source.startsWith('/en')), false)
})
