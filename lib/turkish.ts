// Small Turkish grammar helpers for generated copy (place names, titles inside sentences).

const BACK_VOWELS = 'aıouâû'
const VOWELS = /[aeıioöuüâîû]/g
const VOICELESS_CONSONANTS = 'fstkçşhp'

function lastVowel(name: string) {
  const vowels = name.toLocaleLowerCase('tr-TR').match(VOWELS)
  return vowels?.[vowels.length - 1] || 'e'
}

function lastLetter(name: string) {
  const letters = name.toLocaleLowerCase('tr-TR').match(/\p{L}/gu)
  return letters?.[letters.length - 1] || ''
}

/**
 * Turkish locative suffix (-de/-da/-te/-ta) with vowel harmony and consonant hardening:
 * İstanbul → da, Kadıköy → de, Tokat → ta, Muş → ta, Ege → de, Çankaya → da.
 */
export function locativeSuffix(name: string) {
  const vowel = BACK_VOWELS.includes(lastVowel(name)) ? 'a' : 'e'
  const consonant = VOICELESS_CONSONANTS.includes(lastLetter(name)) ? 't' : 'd'
  return `${consonant}${vowel}`
}

/** "İstanbul'da", "Kadıköy'de", "Tokat'ta" — the place name in the locative case. */
export function inPlace(name: string) {
  return `${name}'${locativeSuffix(name)}`
}

/** "İstanbul'daki", "Kadıköy'deki", "Tokat'taki" — the locative + relative -ki form. */
export function ofPlace(name: string) {
  return `${name}'${locativeSuffix(name)}ki`
}

function lowerSegment(segment: string) {
  const letters = segment.replace(/[^\p{L}]/gu, '')
  const isAcronym = letters.length >= 2 && letters === letters.toLocaleUpperCase('tr-TR')
  const isMixedCaseBrand = /^\p{Lu}\p{Ll}+\p{Lu}/u.test(segment)
  return isAcronym || isMixedCaseBrand ? segment : segment.toLocaleLowerCase('tr-TR')
}

/**
 * Lowercases a Turkish title for use inside a sentence while keeping acronyms and
 * brand-cased words intact: "CRM Yazılım Çözümleri" → "CRM yazılım çözümleri",
 * "SaaS Yazılım Geliştirme" → "SaaS yazılım geliştirme", "API & Sistem" → "API & sistem".
 */
export function lowerKeepAcronyms(text: string) {
  return text
    .split(/(\s+|[-/&])/)
    .map((part) => (/^(\s+|[-/&])$/.test(part) || !part ? part : lowerSegment(part)))
    .join('')
}
