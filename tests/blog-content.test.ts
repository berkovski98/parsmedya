import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import { countWords, extractFaqs, parseContent, parseInline } from '../lib/blog-content'

test('parseContent supports headings, lists, tables and links', () => {
  const blocks = parseContent([
    '## Başlık',
    '',
    'Paragraf içinde [özel yazılım](/hizmetler/ozel-yazilim-gelistirme) linki.',
    '',
    '### Alt başlık',
    '',
    '- Birinci madde',
    '- İkinci madde',
    '',
    '| A | B |',
    '| --- | --- |',
    '| 1 | 2 |',
  ].join('\n'))

  assert.equal(blocks[0].type, 'heading')
  if (blocks[0].type === 'heading') assert.equal(blocks[0].level, 2)
  assert.equal(blocks[1].type, 'paragraph')
  if (blocks[1].type === 'paragraph') {
    assert.equal(blocks[1].nodes.some((n) => n.type === 'link' && n.href === '/hizmetler/ozel-yazilim-gelistirme'), true)
  }
  assert.equal(blocks[2].type, 'heading')
  if (blocks[2].type === 'heading') assert.equal(blocks[2].level, 3)
  assert.equal(blocks[3].type, 'list')
  if (blocks[3].type === 'list') assert.equal(blocks[3].items.length, 2)
  assert.equal(blocks[4].type, 'table')
  if (blocks[4].type === 'table') assert.deepEqual(blocks[4].headers, ['A', 'B'])
})

test('extractFaqs reads SSS section', () => {
  const faqs = extractFaqs([
    '## Sık Sorulan Sorular',
    '',
    '### CRM gerekli mi?',
    '',
    'Küçük ekiplerde bile takip edilmeyen talep kayıptır.',
    '',
    '### Süre ne kadar?',
    '',
    'Kapsama göre değişir.',
  ].join('\n'))
  assert.equal(faqs.length, 2)
  assert.equal(faqs[0].question, 'CRM gerekli mi?')
  assert.match(faqs[0].answer, /talep/)
})

test('parseInline keeps plain text without links', () => {
  assert.deepEqual(parseInline('sade metin'), [{ type: 'text', text: 'sade metin' }])
})

test('seed posts exist and meet length floor', async () => {
  const slugs = [
    'istanbul-yazilim-sirketleri',
    'ozel-yazilim-nedir',
    'crm-yazilimi-nedir',
    'erp-yazilimi-nedir',
    'web-yazilim-nedir',
  ]
  for (const slug of slugs) {
    const raw = await readFile(new URL(`../content/blog-posts/${slug}.json`, import.meta.url), 'utf8')
    const post = JSON.parse(raw)
    assert.equal(post.slug, slug)
    assert.ok(countWords(post.content) >= 1800, `${slug} word count`)
    assert.ok(post.seo_description.length >= 120 && post.seo_description.length <= 165)
    assert.ok(post.content.includes('## Sık Sorulan Sorular'))
    assert.ok(post.content.includes('/iletisim'))
  }
})
