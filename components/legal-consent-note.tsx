import Link from 'next/link'
import { LEGAL_PAGES_PUBLISHED } from '@/lib/company-profile'
import type { Locale } from '@/lib/i18n'
import { LEGAL_LINKS } from '@/lib/legal-pages'

/** "KVKK aydınlatma metni" link under the contact forms; hidden until the legal texts are published. */
export function LegalConsentNote({ locale }: { locale: Locale }) {
  if (!LEGAL_PAGES_PUBLISHED) return null
  const english = locale === 'en'
  return (
    <p className="text-xs leading-relaxed text-muted-foreground">
      {english ? 'By sending this form you confirm that you have read our ' : 'Formu göndererek '}
      <Link href={LEGAL_LINKS[locale].kvkk} className="font-medium text-foreground underline underline-offset-2">
        {english ? 'Privacy Policy' : 'KVKK Aydınlatma Metni'}
      </Link>
      {english ? '.' : '’ni okuduğunuzu onaylarsınız.'}
    </p>
  )
}
