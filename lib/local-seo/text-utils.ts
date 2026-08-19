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

export function clipMeta(text: string) {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (normalized.length >= 140 && normalized.length <= 160) return normalized
  if (normalized.length > 160) {
    const sliced = normalized.slice(0, 159)
    const cut = Math.max(sliced.lastIndexOf(' '), 120)
    return `${sliced.slice(0, cut).replace(/[,:;.-]+$/, '')}.`
  }
  const filler = ' Pars Medya ile kapsamı birlikte netleştirin.'
  const padded = `${normalized}${filler}`
  if (padded.length <= 160) return padded
  return `${normalized} Pars Medya ile planlayın.`
}

function lastVowel(name: string) {
  const vowels = name.toLocaleLowerCase('tr-TR').match(/[aeıioöuü]/g)
  return vowels?.[vowels.length - 1] || 'e'
}

export function locativeSuffix(name: string) {
  return 'aıou'.includes(lastVowel(name)) ? 'da' : 'de'
}

export function possessive(name: string) {
  return `${name}'${locativeSuffix(name)}`
}

export function locative(name: string) {
  return `${name}'${locativeSuffix(name)}ki`
}

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
