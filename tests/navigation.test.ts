import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getRegionLinks } from '../lib/navigation'

test('region navigation lists all seven geographic regions', () => {
  const links = getRegionLinks()
  assert.equal(links.length, 7)
  assert.ok(links.some((item) => item.label === 'Marmara' && item.href === '/hizmet-bolgeleri/marmara'))
  assert.ok(links.some((item) => item.label === 'İç Anadolu' && item.href === '/hizmet-bolgeleri/ic-anadolu'))
  assert.ok(links.every((item) => item.href.startsWith('/hizmet-bolgeleri/') && item.cityCount > 0))
})
