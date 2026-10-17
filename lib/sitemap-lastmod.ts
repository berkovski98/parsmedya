/**
 * lastmod for URLs whose content comes from code (corporate pages, service pages, local pages).
 * Search engines ignore lastmod values that change on every request, so this is a fixed date:
 * bump it in the same commit that meaningfully changes that content. Blog URLs use the post's
 * own updated_at instead.
 */
export const STATIC_CONTENT_UPDATED_AT = '2026-10-17T00:00:00.000Z'
