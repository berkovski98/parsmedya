export function getSiteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL
  if (!value) throw new Error('NEXT_PUBLIC_SITE_URL environment değişkeni eksik.')
  return value.replace(/\/$/, '')
}
