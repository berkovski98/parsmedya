import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { validateAnalyticsPayload, validateSiteEventPayload } from '../lib/analytics-validation'
import { CASE_STUDIES, REFERENCES_PUBLISHED, isPublishableCaseStudy } from '../lib/company-profile'
import { contactSourceLabel } from '../lib/contact'
import { topicSubject } from '../lib/engagement'
import { PORTFOLIO_REDIRECTS } from '../lib/locale-redirects.mjs'
import { getCorporateLinks } from '../lib/navigation'
import { services } from '../lib/services'
import { cleanAttribution, cleanReferrer, cleanToken, contactEventForHref, isMissingFunctionError, utmFromSearch } from '../lib/site-events'
import { publishedOptionalPaths } from '../lib/sitemap-xml'

const ids = { visitorId: 'visitor-1234', sessionId: 'session-1234' }

test('contact links are classified as conversion events', () => {
  assert.equal(contactEventForHref('tel:+905398401898'), 'phone_click')
  assert.equal(contactEventForHref('mailto:info@parsmedya.net'), 'email_click')
  assert.equal(contactEventForHref('https://wa.me/905398401898?text=x'), 'whatsapp_click')
  assert.equal(contactEventForHref('https://parsmedya.net/iletisim'), null)
})

test('UTM values and referrers are cleaned', () => {
  assert.deepEqual(utmFromSearch('?utm_source=Google&utm_medium=cpc&utm_campaign=edi%20q4'), { utmSource: 'Google', utmMedium: 'cpc', utmCampaign: 'edi q4' })
  assert.equal(cleanToken('<script>x</script>'), 'scriptx/script')
  assert.equal(cleanToken('a'.repeat(300))?.length, 100)
  assert.equal(cleanReferrer('https://www.google.com/search?q=edi'), 'https://www.google.com/search')
  assert.equal(cleanReferrer('https://parsmedya.net/hizmetler', 'www.parsmedya.net'), undefined)
  assert.equal(cleanReferrer('javascript:alert(1)'), undefined)
  assert.deepEqual(cleanAttribution({ landingPath: '/edi?x=1', utmSource: 'linkedin' }), { landingPath: '/edi', referrer: undefined, utmSource: 'linkedin', utmMedium: undefined, utmCampaign: undefined })
})

test('site events are validated separately from page views', () => {
  const event = validateSiteEventPayload({ event: 'whatsapp_click', pathname: '/en/contact', target: 'header', utmSource: 'google', ...ids })
  assert.equal(event?.event, 'whatsapp_click')
  assert.equal(event?.locale, 'en')
  assert.equal(event?.target, 'header')
  assert.equal(event?.utmSource, 'google')
  assert.equal(validateSiteEventPayload({ event: 'page_view', pathname: '/', ...ids }), null)
  assert.equal(validateSiteEventPayload({ event: 'form_submit', pathname: '/admin', ...ids }), null)
  assert.equal(validateSiteEventPayload({ event: 'phone_click', pathname: '/', target: 'Bad Target!', ...ids })?.target, undefined)
  assert.equal(validateAnalyticsPayload({ event: 'whatsapp_click', pathname: '/', ...ids }), null)
})

test('missing Supabase functions are detected so tracking degrades quietly', () => {
  assert.equal(isMissingFunctionError({ code: 'PGRST202', message: 'Could not find the function public.record_site_event' }), true)
  assert.equal(isMissingFunctionError({ code: '23514', message: 'check violation' }), false)
  assert.equal(isMissingFunctionError(null), false)
})

test('conversion migration is additive and grants only the narrow functions', () => {
  const sql = readFileSync(join(process.cwd(), 'supabase/migrations/010_conversion_tracking.sql'), 'utf8')
  assert.doesNotMatch(sql, /\bdrop table\b|\btruncate\b|\bdelete from\b/i)
  assert.match(sql, /grant execute on function public\.record_site_event\([^)]*\) to anon, authenticated/)
  assert.match(sql, /grant execute on function public\.submit_contact_message_v2\([^)]*\) to anon, authenticated/)
  assert.match(sql, /grant execute on function public\.get_conversion_summary\(\) to authenticated;/)
  assert.match(sql, /revoke all on public\.site_events from anon, authenticated/)
  const names = readdirSync(join(process.cwd(), 'supabase/migrations')).filter((name) => name.startsWith('010_'))
  assert.equal(names.length, 1)
})

test('contact source label prefers UTM, then referrer host', () => {
  assert.equal(contactSourceLabel({ utm_source: 'google', utm_medium: 'cpc', utm_campaign: null, referrer: null }), 'google / cpc')
  assert.equal(contactSourceLabel({ utm_source: null, utm_medium: null, utm_campaign: null, referrer: 'https://www.linkedin.com/feed' }), 'linkedin.com')
  assert.equal(contactSourceLabel({ utm_source: null, utm_medium: null, utm_campaign: null, referrer: null }), null)
})

test('references list real projects; only owner-cleared clients are named', () => {
  assert.equal(REFERENCES_PUBLISHED, true)
  assert.equal(CASE_STUDIES.length, 5)
  for (const study of CASE_STUDIES) {
    assert.ok(isPublishableCaseStudy(study))
    assert.equal(study.delivered.tr.length, study.delivered.en.length)
    if (study.client) {
      assert.equal(study.clientApproved, true, `${study.slug} is named without approval`)
      assert.equal(study.anonymized, false)
    } else {
      assert.equal(study.anonymized, true)
      // No client names or invented metrics in anonymized studies.
      assert.doesNotMatch(JSON.stringify(study), /Hapag|Doğan|Servisium|Bidolu|%\d|\d+\s?%/)
    }
  }
  const ssp = CASE_STUDIES.find((study) => study.slug === 'swiss-sales-partners')
  assert.equal(ssp?.client?.url, 'https://swisssales-partners.ch')
  assert.deepEqual(publishedOptionalPaths('tr').filter((path) => path === '/referanslar'), ['/referanslar'])
  assert.ok(getCorporateLinks('tr').some((link) => link.href === '/referanslar'))
  assert.ok(getCorporateLinks('en').some((link) => link.href === '/en/references'))
  assert.ok(PORTFOLIO_REDIRECTS.some((item) => item.source === '/projeler' && item.destination === '/referanslar'))
})

test('unverifiable numeric claims are gone from service data', () => {
  const values = services.flatMap((service) => service.stats.map((stat) => stat.value))
  for (const value of values) assert.doesNotMatch(value, /\d/, `numeric claim left: ${value}`)
})

test('engagement topics pre-fill the contact subject', () => {
  assert.equal(topicSubject('?konu=discovery', 'tr'), 'Keşif Atölyesi talebi')
  assert.equal(topicSubject('?konu=pilot', 'en'), 'Fixed-scope pilot request')
  assert.equal(topicSubject('?konu=unknown', 'tr'), null)
})
