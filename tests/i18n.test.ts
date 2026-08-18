import assert from 'node:assert/strict'
import { test } from 'node:test'
import { alternatePath, localeHomePath, paths } from '../lib/i18n'
import { TR_PREFIX_REDIRECTS } from '../lib/locale-redirects.mjs'

test('locale homes keep Turkish at the root and English under /en', () => {
  assert.equal(localeHomePath('tr'), '/')
  assert.equal(localeHomePath('en'), '/en')
  assert.equal(paths.about('tr'), '/hakkimizda')
  assert.equal(paths.about('en'), '/en/about')
  assert.equal(paths.blogPost('tr', 'foo'), '/blog/foo')
  assert.equal(paths.blogPost('en', 'foo-en'), '/en/blog/foo-en')
})

test('language switch maps paired public pages', () => {
  assert.equal(alternatePath('/'), '/en')
  assert.equal(alternatePath('/tr'), '/en')
  assert.equal(alternatePath('/en'), '/')
  assert.equal(alternatePath('/hakkimizda'), '/en/about')
  assert.equal(alternatePath('/tr/hakkimizda'), '/en/about')
  assert.equal(alternatePath('/en/about'), '/hakkimizda')
  assert.equal(alternatePath('/hizmetler/ozel-yazilim-gelistirme'), '/en/services/custom-software-development')
  assert.equal(alternatePath('/en/services/custom-software-development'), '/hizmetler/ozel-yazilim-gelistirme')
  assert.equal(alternatePath('/blog/foo'), '/en/blog')
  assert.equal(alternatePath('/en/blog/foo-en'), '/blog')
})

test('legacy /tr URLs permanently redirect to unprefixed Turkish pages', () => {
  const map = Object.fromEntries(TR_PREFIX_REDIRECTS.map((rule) => [rule.source, rule]))
  assert.equal(map['/tr'].destination, '/')
  assert.equal(map['/tr/hakkimizda'].destination, '/hakkimizda')
  assert.equal(map['/tr/vizyonumuz'].destination, '/vizyonumuz')
  assert.equal(map['/tr/misyonumuz'].destination, '/misyonumuz')
  assert.equal(map['/vizyon'].destination, '/vizyonumuz')
  assert.equal(map['/misyon'].destination, '/misyonumuz')
  assert.equal(map['/tr/hizmetler'].destination, '/hizmetler')
  assert.equal(map['/tr/hizmetler/:slug'].destination, '/hizmetler/:slug')
  assert.equal(map['/tr/blog'].destination, '/blog')
  assert.equal(map['/tr/blog/:slug'].destination, '/blog/:slug')
  assert.equal(map['/tr/iletisim'].destination, '/iletisim')
  assert.equal(map['/tr/:path*'].destination, '/:path*')
  assert.ok(TR_PREFIX_REDIRECTS.every((rule) => rule.permanent === true))
  assert.equal(TR_PREFIX_REDIRECTS.some((rule) => rule.source.startsWith('/admin') || rule.source.startsWith('/en')), false)
})
