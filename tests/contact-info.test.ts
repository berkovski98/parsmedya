import assert from 'node:assert/strict'
import { test } from 'node:test'
import { MOBILE_PHONE, OFFICE_PHONE, WHATSAPP_MESSAGES, phoneDisplay, whatsappHref } from '../lib/contact-info'

test('mobile phone link dials the international number', () => {
  assert.equal(MOBILE_PHONE.href, 'tel:+905398401898')
  assert.equal(MOBILE_PHONE.display, '0539 840 18 98')
  assert.equal(phoneDisplay('tr'), '0539 840 18 98')
  assert.equal(phoneDisplay('en'), '+90 539 840 18 98')
})

test('existing office landline is preserved', () => {
  assert.equal(OFFICE_PHONE.href, 'tel:+902129637777')
})

test('WhatsApp links carry the encoded message for each locale', () => {
  const tr = new URL(whatsappHref('tr'))
  assert.equal(tr.origin + tr.pathname, 'https://wa.me/905398401898')
  assert.equal(tr.searchParams.get('text'), 'Merhaba Pars Medya, hizmetleriniz hakkında bilgi almak istiyorum.')
  assert.ok(whatsappHref('tr').includes('hakk%C4%B1nda'))

  const en = new URL(whatsappHref('en'))
  assert.equal(en.searchParams.get('text'), WHATSAPP_MESSAGES.en)
  assert.equal(WHATSAPP_MESSAGES.en, 'Hello Pars Medya, I would like to learn more about your services.')
  assert.ok(!whatsappHref('en').includes(' '))
})
