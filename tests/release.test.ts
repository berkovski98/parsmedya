import assert from 'node:assert/strict'
import { test } from 'node:test'
import { confirmInstalledVersion, isUpdateAvailable, nextBuildNumber, parseBuildNumber } from '../lib/system-update/release'

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
