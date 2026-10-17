/**
 * Company facts that only the owner can confirm. Nothing here may be guessed.
 *
 * A `null` value renders as a clearly marked "[DOLDURULACAK: …]" placeholder on the pages that
 * need it. While placeholders remain, the legal and reference pages stay `noindex`, out of the
 * sitemaps and unlinked from the footer and forms (see LEGAL_PAGES_PUBLISHED / REFERENCES_PUBLISHED).
 */
export const COMPANY_PROFILE = {
  /** Ticari unvan, e.g. "… Bilişim Hizmetleri Ltd. Şti." */
  legalName: null as string | null,
  /** Açık adres (sokak, no, ilçe/il) exactly as registered and as on Google Business Profile. */
  streetAddress: null as string | null,
  postalCode: null as string | null,
  mersisNo: null as string | null,
  taxOffice: null as string | null,
  taxNumber: null as string | null,
  /** Where data subjects send KVKK applications (e-posta, KEP or posta adresi). */
  kvkkApplicationChannel: null as string | null,
  /** Name/location of hosting and database providers as stated in the processing agreements. */
  dataProcessors: null as string | null,
  /** Retention periods per data category, as decided with legal counsel. */
  retentionPeriods: null as string | null,
  /** Legal bases (KVKK md. 5/6) per processing purpose, as decided with legal counsel. */
  legalBases: null as string | null,
  /** Whether data is transferred abroad (KVKK md. 9) and on which basis. */
  foreignTransfer: null as string | null,
}

/** Flip to true only after every legal text has been completed and reviewed by counsel. */
export const LEGAL_PAGES_PUBLISHED: boolean = false

export type TeamMember = { name: string; role: string; linkedin?: string; bio?: string }
/** Real team members only (name, role, optional LinkedIn). Empty list = the section is hidden. */
export const TEAM_MEMBERS: TeamMember[] = []

export type CaseStudy = {
  client: string
  title: string
  problem: string
  solution: string
  result: string
  technologies: string[]
  /** Written permission from the client to publish their name and results. */
  clientApproved: boolean
}
/** Real, client-approved case studies only. */
export const CASE_STUDIES: CaseStudy[] = []

/** Flip to true once CASE_STUDIES holds approved, real projects. */
export const REFERENCES_PUBLISHED: boolean = false

export const PLACEHOLDER_PREFIX = 'DOLDURULACAK'

/** Every owner-input item, listed for the hand-over report and the admin. */
export function missingCompanyFacts() {
  const missing: string[] = Object.entries(COMPANY_PROFILE)
    .filter(([, value]) => value === null)
    .map(([key]) => key)
  if (!TEAM_MEMBERS.length) missing.push('TEAM_MEMBERS')
  if (!CASE_STUDIES.some((item) => item.clientApproved)) missing.push('CASE_STUDIES')
  return missing
}
