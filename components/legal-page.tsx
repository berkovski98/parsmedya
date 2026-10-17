import { Fragment } from 'react'
import { PageHeader } from '@/components/page-header'
import { COMPANY_PROFILE, LEGAL_PAGES_PUBLISHED, PLACEHOLDER_PREFIX } from '@/lib/company-profile'
import { legalDraftNotice, type LegalPage } from '@/lib/legal-pages'

const TOKEN = /\{\{(fact:([a-zA-Z]+)|todo)\|([^}]+)\}\}/g

function Placeholder({ label }: { label: string }) {
  return <mark className="rounded bg-accent/15 px-1 font-semibold text-foreground">[{PLACEHOLDER_PREFIX}: {label}]</mark>
}

/** Renders {{fact:key|Label}} with the confirmed value, or a marked placeholder; {{todo|Label}} always as placeholder. */
function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = []
  let last = 0
  for (const match of text.matchAll(TOKEN)) {
    const [whole, , factKey, label] = match
    parts.push(text.slice(last, match.index))
    const value = factKey ? COMPANY_PROFILE[factKey as keyof typeof COMPANY_PROFILE] : null
    parts.push(value ? value : <Placeholder label={label} />)
    last = (match.index ?? 0) + whole.length
  }
  parts.push(text.slice(last))
  return <>{parts.map((part, index) => <Fragment key={index}>{part}</Fragment>)}</>
}

export function LegalPageView({ page }: { page: LegalPage }) {
  const english = page.locale === 'en'
  return (
    <>
      <PageHeader locale={page.locale} parent={{ label: english ? 'Legal' : 'Yasal' }} eyebrow={page.title} title={page.title} description={page.intro} />
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-20">
          {!LEGAL_PAGES_PUBLISHED && (
            <p role="note" className="mb-10 rounded-xl border border-dashed border-accent/60 bg-accent/10 p-4 text-sm leading-relaxed text-foreground">
              {legalDraftNotice(page.locale)}
            </p>
          )}
          <div className="space-y-10">
            {page.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">{section.heading}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="mt-4 leading-relaxed text-muted-foreground"><RichText text={paragraph} /></p>
                ))}
                {section.items && (
                  <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-muted-foreground">
                    {section.items.map((item) => <li key={item}><RichText text={item} /></li>)}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
