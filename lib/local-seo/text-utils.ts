import { inPlace, ofPlace } from '@/lib/turkish'

export { inPlace, locativeSuffix, lowerKeepAcronyms, ofPlace } from '@/lib/turkish'

export function hash(value: string) {
  let result = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index)
    result = Math.imul(result, 16777619)
  }
  return result >>> 0
}

export function pick<T>(items: readonly T[], seed: string, salt = 0) {
  return items[(hash(`${seed}:${salt}`) + salt) % items.length]
}

export const META_DESCRIPTION_MAX = 160
const META_DESCRIPTION_TARGET = 140

const META_FILLERS = {
  tr: [' Pars Medya ile kapsamı birlikte netleştirin.', ' Kapsamı birlikte netleştirelim.'],
  en: [' Plan your project with Pars Medya.', ' Let’s define the scope together.'],
} as const

function endWithPunctuation(text: string) {
  return /[.!?…]$/.test(text) ? text : `${text}.`
}

/**
 * Normalizes a meta description to at most 160 characters.
 * Long text is cut at a word boundary; short text gets one closing sentence only when it
 * still fits and does not repeat a sentence that is already there.
 */
export function clipMeta(text: string, locale: 'tr' | 'en' = 'tr') {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (normalized.length > META_DESCRIPTION_MAX) {
    const sliced = normalized.slice(0, META_DESCRIPTION_MAX - 1)
    const lastSpace = sliced.lastIndexOf(' ')
    const cut = lastSpace >= 100 ? lastSpace : sliced.length
    return `${sliced.slice(0, cut).replace(/[\s,:;.\-–—]+$/, '')}.`
  }
  if (normalized.length >= META_DESCRIPTION_TARGET) return normalized
  const base = endWithPunctuation(normalized)
  for (const filler of META_FILLERS[locale]) {
    if (base.includes(filler.trim())) continue
    if (filler.includes('Pars Medya') && base.includes('Pars Medya')) continue
    const padded = `${base}${filler}`
    if (padded.length <= META_DESCRIPTION_MAX) return padded
  }
  return base.length <= META_DESCRIPTION_MAX ? base : normalized
}

/** @deprecated use inPlace — kept for existing imports. */
export const possessive = inPlace
/** @deprecated use ofPlace — kept for existing imports. */
export const locative = ofPlace

export function pickMany<T>(items: readonly T[], seed: string, count: number, startSalt = 0) {
  const result: T[] = []
  const used = new Set<number>()
  let salt = startSalt
  while (result.length < count && used.size < items.length) {
    const index = (hash(`${seed}:${salt}`) + salt) % items.length
    if (!used.has(index)) {
      used.add(index)
      result.push(items[index]!)
    }
    salt += 1
  }
  return result
}
