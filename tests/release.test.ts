import assert from 'node:assert/strict'
import { test } from 'node:test'
import { confirmInstalledVersion, isUpdateAvailable, nextBuildNumber, parseBuildNumber, parseReleaseCandidate } from '../lib/system-update/release'

test('F build number increments only on successful production confirm', () => {
  assert.equal(parseBuildNumber('12'), 12)
  assert.equal(nextBuildNumber('12'), '13')
  assert.equal(nextBuildNumber(12), '13')
  assert.equal(nextBuildNumber(''), '1')

  const confirmed = confirmInstalledVersion(
    {
      version: '1.1.3',
      build: '12',
      commit: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      releasedAt: '2026-08-18T00:00:00.000Z',
      releaseTitle: 'Kurulu',
      releaseNotes: [],
    },
    {
      version: '1.1.4',
      commit: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
      releaseTitle: 'Güncelleme',
      summary: 'Yeni sürüm kurulur.',
      releaseNotes: ['Yeni sürüm'],
    },
    '2026-08-18T13:00:00.000Z',
  )
  assert.equal(confirmed.version, '1.1.4')
  assert.equal(confirmed.build, '13')
  assert.equal(confirmed.commit, 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')
  assert.equal(confirmed.releasedAt, '2026-08-18T13:00:00.000Z')

  const afterThreeUndeployedCommits = nextBuildNumber('12')
  assert.equal(afterThreeUndeployedCommits, '13')
})

test('updateAvailable compares installed production against the GitHub candidate', () => {
  assert.equal(isUpdateAvailable(
    { version: '1.1.3', commit: 'aaa' },
    { version: '1.1.4', commit: 'bbb' },
  ), true)
  assert.equal(isUpdateAvailable(
    { version: '1.1.3', commit: 'aaa' },
    { version: '1.1.3', commit: 'aaa' },
  ), false)
  assert.equal(isUpdateAvailable(
    { version: '1.1.3', commit: 'aaa' },
    { version: '1.1.3', commit: 'bbb' },
  ), true)
  assert.equal(isUpdateAvailable(
    { version: '1.1.3', commit: 'aaa' },
    { version: '1.1.4', commit: 'aaa' },
  ), true)
})

test('release manifest accepts title, summary and changes aliases', () => {
  const parsed = parseReleaseCandidate({
    version: '1.1.1',
    title: 'Yönetim Paneli ve Hizmet Sayfaları Güncellemesi',
    summary: 'Yönetim paneli ve hizmet sayfalarında iyileştirmeler yapıldı.',
    changes: ['Hizmet sayfalarının görsel yapısı yenilendi.'],
  })
  assert.equal(parsed.version, '1.1.1')
  assert.equal(parsed.releaseTitle, 'Yönetim Paneli ve Hizmet Sayfaları Güncellemesi')
  assert.equal(parsed.summary, 'Yönetim paneli ve hizmet sayfalarında iyileştirmeler yapıldı.')
  assert.deepEqual(parsed.releaseNotes, ['Hizmet sayfalarının görsel yapısı yenilendi.'])
})
