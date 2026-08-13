import type { Metadata } from 'next'

export function localizedAlternates(canonical: string, tr: string, en: string): Metadata['alternates'] {
  return { canonical, languages: { tr, en, 'x-default': tr } }
}
