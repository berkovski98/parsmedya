import { TEAM_MEMBERS } from '@/lib/company-profile'
import type { Locale } from '@/lib/i18n'
import { orgRef } from '@/lib/schema/organization'
import { safeJsonLd } from '@/lib/seo'

/** Team block for the about pages (Ö12). Renders nothing until real members are added to TEAM_MEMBERS. */
export function TeamSection({ locale }: { locale: Locale }) {
  if (!TEAM_MEMBERS.length) return null
  const english = locale === 'en'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': TEAM_MEMBERS.map((member) => ({
      '@type': 'Person',
      name: member.name,
      jobTitle: member.role,
      worksFor: orgRef(),
      ...(member.linkedin ? { sameAs: [member.linkedin] } : {}),
    })),
  }
  return (
    <section className="border-t border-border bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <p className="eyebrow">{english ? 'Team' : 'Ekip'}</p>
        <h2 className="mt-3 font-display text-3xl font-bold">{english ? 'The people behind Pars Medya' : 'Pars Medya ekibi'}</h2>
        <ul className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM_MEMBERS.map((member) => (
            <li key={member.name} className="rounded-2xl border border-border bg-card p-6">
              <p className="font-display text-lg font-bold">{member.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{member.role}</p>
              {member.bio && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>}
              {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex text-sm font-medium text-accent-strong hover:underline">LinkedIn</a>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
