import type { Locale } from '@/lib/i18n'

/**
 * The single wording for Pars Medya's international work. The owner confirmed real projects
 * and partners in these markets; keep it to this one measured sentence (no office or headcount
 * claims) and reuse it instead of rephrasing it per page.
 */
export const INTERNATIONAL_STATEMENT: Record<Locale, string> = {
  tr: 'İstanbul merkezli ekibimiz, Dubai, Moskova ve İsviçre’deki iş ortaklarımızla bu pazarlardaki projelerde de çalışıyor.',
  en: 'Our Istanbul-based team also works on projects in Dubai, Moscow and Switzerland together with partners in those markets.',
}
