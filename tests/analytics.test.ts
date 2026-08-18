import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { afterEach, test } from 'node:test'
import { createAnonymousId, isAnalyticsDomEnabled, shouldSkipDuplicatePath } from '../lib/analytics-client'
import { analyticsDisabledReason, isAnalyticsEnabled, reportAnalyticsEnvPresence } from '../lib/analytics-config'
import { classifyTrafficSource, mapRpcResult, publicAnalyticsError, summarizePageViews } from '../lib/analytics-query'
import { allowAnalyticsRequest, resetAnalyticsRateLimit } from '../lib/analytics-rate-limit'
import { isBotUserAgent, isTrackablePath, localeFromPath, normalizeAnalyticsPath, validateAnalyticsPayload } from '../lib/analytics-validation'

const originalAnalytics = process.env.ANALYTICS_ENABLED
const originalPublicAnalytics = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED

afterEach(() => {
  resetAnalyticsRateLimit()
  if (originalAnalytics === undefined) delete process.env.ANALYTICS_ENABLED
  else process.env.ANALYTICS_ENABLED = originalAnalytics
  if (originalPublicAnalytics === undefined) delete process.env.NEXT_PUBLIC_ANALYTICS_ENABLED
  else process.env.NEXT_PUBLIC_ANALYTICS_ENABLED = originalPublicAnalytics
})

test('analytics is disabled when env is unset', () => {
  delete process.env.ANALYTICS_ENABLED
  delete process.env.NEXT_PUBLIC_ANALYTICS_ENABLED
  assert.equal(isAnalyticsEnabled(), false)
  assert.match(analyticsDisabledReason() || '', /unset/)
})

test('analytics is disabled when public flag is false', () => {
  delete process.env.ANALYTICS_ENABLED
  process.env.NEXT_PUBLIC_ANALYTICS_ENABLED = 'false'
  assert.equal(isAnalyticsEnabled(), false)
})

test('analytics is enabled when public flag is true', () => {
  delete process.env.ANALYTICS_ENABLED
  process.env.NEXT_PUBLIC_ANALYTICS_ENABLED = 'true'
  assert.equal(isAnalyticsEnabled(), true)
})

test('runtime ANALYTICS_ENABLED overrides public flag', () => {
  process.env.NEXT_PUBLIC_ANALYTICS_ENABLED = 'false'
  process.env.ANALYTICS_ENABLED = 'true'
  assert.equal(isAnalyticsEnabled(), true)
  process.env.ANALYTICS_ENABLED = 'false'
  process.env.NEXT_PUBLIC_ANALYTICS_ENABLED = 'true'
  assert.equal(isAnalyticsEnabled(), false)
})

test('trackable public paths include TR, EN, blog, services and local SEO', () => {
  for (const path of ['/', '/tr', '/en', '/tr/blog', '/en/blog', '/tr/hizmetler', '/en/services', '/tr/istanbul/kadikoy', '/tr/hizmet-bolgeleri']) {
    assert.equal(isTrackablePath(path), true, path)
  }
})

test('admin, api, sitemap and assets are not trackable', () => {
  for (const path of ['/admin', '/admin/analytics', '/api/analytics', '/api/analytics/track', '/sitemap.xml', '/sitemap-en.xml', '/robots.txt', '/logo.png', '/_next/static/chunk.js']) {
    assert.equal(isTrackablePath(path), false, path)
  }
})

test('query parameters are stripped from tracked paths', () => {
  assert.equal(normalizeAnalyticsPath('/search?q=berk'), '/search')
  assert.equal(normalizeAnalyticsPath('/tr/blog/?utm_source=google'), '/tr/blog')
  const payload = validateAnalyticsPayload({
    event: 'page_view',
    pathname: '/tr/hizmetler/erp-yazilim-cozumleri?ref=home',
    visitorId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    locale: 'tr',
  })
  assert.equal(payload?.path, '/tr/hizmetler/erp-yazilim-cozumleri')
})

test('TR/EN locale is derived from the URL', () => {
  assert.equal(localeFromPath('/tr/hizmetler'), 'tr')
  assert.equal(localeFromPath('/en/services/website-development'), 'en')
  assert.equal(localeFromPath('/en'), 'en')
})

test('bot filter rejects crawlers but not browsers', () => {
  assert.equal(isBotUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126.0.0.0 Safari/537.36'), false)
  assert.equal(isBotUserAgent('Googlebot'), true)
  assert.equal(isBotUserAgent('bingbot/2.0'), true)
  assert.equal(isBotUserAgent(''), true)
})

test('payload validation accepts UUID visitor and session ids', () => {
  const payload = validateAnalyticsPayload({
    event: 'page_view',
    pathname: '/en/about',
    visitorId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    sessionId: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
    referrer: 'https://google.com/search?q=secret',
  })
  assert.ok(payload)
  assert.equal(payload?.path, '/en/about')
  assert.equal(payload?.locale, 'en')
  assert.equal(payload?.referrer, 'https://google.com/search')
})

test('payload validation rejects admin paths and short ids', () => {
  assert.equal(validateAnalyticsPayload({ path: '/admin', visitorId: 'abcdefgh', sessionId: 'ijklmnop' }), null)
  assert.equal(validateAnalyticsPayload({ path: '/', visitorId: 'short', sessionId: 'also-short' }), null)
})

test('analytics disabled means tracker should not send', () => {
  assert.equal(isAnalyticsDomEnabled('off'), false)
  assert.equal(isAnalyticsDomEnabled('on'), true)
})

test('duplicate page navigation is skipped', () => {
  assert.equal(shouldSkipDuplicatePath('/', '/'), true)
  assert.equal(shouldSkipDuplicatePath('/', '/en'), false)
  assert.equal(shouldSkipDuplicatePath(null, '/'), false)
})

test('anonymous visitor is preserved instead of regenerating', () => {
  const first = createAnonymousId('6ba7b810-9dad-11d1-80b4-00c04fd430c8')
  const second = createAnonymousId(first)
  assert.equal(first, second)
})

test('API invalid payload is rejected', () => {
  assert.equal(validateAnalyticsPayload({ path: '/api/analytics', visitorId: 'abcdefgh', sessionId: 'ijklmnop' }), null)
  assert.equal(validateAnalyticsPayload({}), null)
})

test('API valid payload is accepted', () => {
  const payload = validateAnalyticsPayload({
    path: '/',
    visitorId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    sessionId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  })
  assert.ok(payload)
})

test('Supabase error does not fall back to zero metrics', () => {
  const result = mapRpcResult(null, { code: 'PGRST202', message: 'function not found' }, 'Analytics özeti yüklenemedi.')
  assert.equal(result.ok, false)
  if (!result.ok) {
    assert.equal(result.error.code, 'PGRST202')
    assert.notEqual(result.error.message, '0')
    assert.equal(publicAnalyticsError(result.error).title, 'İstatistik verileri alınamadı.')
  }
})

test('7-day and 30-day unique counts stay distinct per visitor', () => {
  const now = new Date('2026-08-19T12:00:00.000Z')
  const rows = [
    { path: '/tr', visitorId: 'a', createdAt: '2026-08-18T10:00:00.000Z', locale: 'tr' as const },
    { path: '/tr/hizmetler', visitorId: 'a', createdAt: '2026-08-18T11:00:00.000Z', locale: 'tr' as const },
    { path: '/en', visitorId: 'b', createdAt: '2026-08-18T12:00:00.000Z', locale: 'en' as const },
    { path: '/tr', visitorId: 'c', createdAt: '2026-07-01T12:00:00.000Z', locale: 'tr' as const },
  ]
  const summary = summarizePageViews(rows, now)
  assert.equal(summary.seven_day_views, 3)
  assert.equal(summary.seven_day_visitors, 2)
  assert.equal(summary.thirty_day_views, 3)
  assert.equal(summary.thirty_day_visitors, 2)
  assert.equal(summary.tr_views, 2)
  assert.equal(summary.tr_visitors, 1)
  assert.equal(summary.en_views, 1)
  assert.equal(summary.en_visitors, 1)
})

test('traffic sources classify Google, Bing, direct and other', () => {
  assert.equal(classifyTrafficSource(undefined), 'Direct')
  assert.equal(classifyTrafficSource('https://www.google.com/'), 'Google')
  assert.equal(classifyTrafficSource('https://www.bing.com/search'), 'Bing')
  assert.equal(classifyTrafficSource('https://example.com'), 'Diğer yönlendirmeler')
})

test('rate limit allows a burst then blocks abuse', () => {
  for (let index = 0; index < 40; index += 1) assert.equal(allowAnalyticsRequest('visitor-a'), true)
  assert.equal(allowAnalyticsRequest('visitor-a'), false)
  assert.equal(allowAnalyticsRequest('visitor-b'), true)
})

test('analytics failure mapping does not crash the website contract', () => {
  assert.doesNotThrow(() => {
    mapRpcResult(null, { code: 'EXCEPTION', message: 'boom' }, 'fail')
  })
})

test('env presence reporter never returns secret values', () => {
  const report = reportAnalyticsEnvPresence()
  assert.equal(['PRESENT', 'MISSING'].includes(report.NEXT_PUBLIC_SUPABASE_URL), true)
  assert.equal(JSON.stringify(report).includes('eyJ'), false)
})

test('unauthorized public analytics SELECT is blocked by RLS policy', () => {
  const sql = readFileSync('supabase/migrations/008_site_analytics_locale.sql', 'utf8')
  assert.match(sql, /revoke all on public.page_views from anon/)
  assert.match(sql, /using \(public.is_admin\(\)\)/)
  assert.match(sql, /grant execute on function public.record_page_view/)
  assert.doesNotMatch(sql, /grant select on public.page_views to anon/)
})
