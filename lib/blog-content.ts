export type InlineNode =
  | { type: 'text'; text: string }
  | { type: 'link'; text: string; href: string }

export type ContentBlock =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; nodes: InlineNode[] }
  | { type: 'list'; ordered: boolean; items: InlineNode[][] }
  | { type: 'table'; headers: string[]; rows: string[][] }

const LINK_RE = /\[([^\]]+)\]\((\/[^)\s]+)\)/g

export function parseInline(text: string): InlineNode[] {
  const nodes: InlineNode[] = []
  let lastIndex = 0
  for (const match of text.matchAll(LINK_RE)) {
    const index = match.index ?? 0
    if (index > lastIndex) nodes.push({ type: 'text', text: text.slice(lastIndex, index) })
    nodes.push({ type: 'link', text: match[1], href: match[2] })
    lastIndex = index + match[0].length
  }
  if (lastIndex < text.length) nodes.push({ type: 'text', text: text.slice(lastIndex) })
  return nodes.length ? nodes : [{ type: 'text', text }]
}

function isTableBlock(block: string) {
  const lines = block.split('\n').map((line) => line.trim()).filter(Boolean)
  if (lines.length < 2) return false
  if (!lines[0].includes('|')) return false
  const separator = lines[1].replace(/\|/g, '').replace(/[\s:-]/g, '')
  return separator.length === 0 && lines[1].includes('-')
}

function parseTable(block: string): ContentBlock {
  const lines = block.split('\n').map((line) => line.trim()).filter(Boolean)
  const cells = (line: string) => line.replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim())
  const headers = cells(lines[0])
  const bodyLines = lines.slice(1).filter((line) => !/^[\s|:-]+$/.test(line))
  return { type: 'table', headers, rows: bodyLines.map(cells) }
}

function isListBlock(block: string) {
  const lines = block.split('\n').map((line) => line.trim()).filter(Boolean)
  return lines.length > 0 && lines.every((line) => /^([-*]|\d+\.)\s+/.test(line))
}

function parseList(block: string): ContentBlock {
  const lines = block.split('\n').map((line) => line.trim()).filter(Boolean)
  const ordered = /^\d+\.\s+/.test(lines[0])
  return {
    type: 'list',
    ordered,
    items: lines.map((line) => parseInline(line.replace(/^([-*]|\d+\.)\s+/, ''))),
  }
}

export function parseContent(content: string): ContentBlock[] {
  return content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const h2 = block.match(/^##\s+(.+)$/)
      if (h2) return { type: 'heading' as const, level: 2 as const, text: h2[1].trim() }
      const h3 = block.match(/^###\s+(.+)$/)
      if (h3) return { type: 'heading' as const, level: 3 as const, text: h3[1].trim() }
      if (isTableBlock(block)) return parseTable(block)
      if (isListBlock(block)) return parseList(block)
      return { type: 'paragraph' as const, nodes: parseInline(block.replace(/^#\s+/, '')) }
    })
}

/** Extract FAQ pairs from ### Question? + following paragraph until next heading. */
export function extractFaqs(content: string): { question: string; answer: string }[] {
  const blocks = parseContent(content)
  const faqs: { question: string; answer: string }[] = []
  let inFaq = false
  let currentQuestion: string | null = null

  for (const block of blocks) {
    if (block.type === 'heading' && block.level === 2) {
      inFaq = /sık sorulan|sss|faq/i.test(block.text)
      currentQuestion = null
      continue
    }
    if (!inFaq) continue
    if (block.type === 'heading' && block.level === 3) {
      currentQuestion = block.text.replace(/\?$/, '') + (block.text.endsWith('?') ? '?' : '')
      continue
    }
    if (currentQuestion && block.type === 'paragraph') {
      const answer = block.nodes.map((node) => node.type === 'text' ? node.text : node.text).join('')
      faqs.push({ question: currentQuestion, answer })
      currentQuestion = null
    }
  }
  return faqs
}

export function countWords(content: string) {
  return content.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').split(/\s+/).filter(Boolean).length
}
