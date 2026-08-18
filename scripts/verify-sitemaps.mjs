#!/usr/bin/env node

const PRODUCTION_SITE_URL = 'https://parsmedya.net'
const base = (process.argv[2] || PRODUCTION_SITE_URL).replace(/\/$/, '')
const timeoutMs = Number(process.env.SITEMAP_VERIFY_TIMEOUT_MS || 20000)
const retries = Number(process.env.SITEMAP_VERIFY_RETRIES || 8)

function fail(message) {
  console.error(`FAIL: ${message}`)
  process.exitCode = 1
}

function locUrls(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map((match) => match[1].trim())
}

function pathnameOf(url) {
  try {
    const pathname = new URL(url).pathname
    if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1)
    return pathname || '/'
  } catch {
    return url
  }
}

function isEnglishPath(pathname) {
  return pathname === '/en' || pathname.startsWith('/en/')
}

function isTurkishPath(pathname) {
  return pathname === '/tr' || pathname.startsWith('/tr/')
}

function isUnprefixedTurkishPath(pathname) {
  if (isEnglishPath(pathname) || isTurkishPath(pathname)) return false
  return [
    '/', '/hakkimizda', '/vizyonumuz', '/vizyon', '/misyonumuz', '/misyon', '/hizmetler', '/iletisim', '/blog',
  ].some((marker) => pathname === marker || pathname.startsWith(`${marker}/`))
}

function containsForbiddenHost(xml) {
  return /localhost|127\.0\.0\.1/i.test(xml)
}

async function fetchText(url) {
  let lastError = null
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        redirect: 'manual',
        headers: { 'user-agent': 'ParsMedyaSitemapVerify/1.0' },
        signal: AbortSignal.timeout(timeoutMs),
      })
      if (response.status >= 300 && response.status < 400) {
        throw new Error(`${url} redirected (${response.status})`)
      }
      if (!response.ok) {
        throw new Error(`${url} HTTP ${response.status}`)
      }
      return {
        status: response.status,
        text: await response.text(),
        contentType: response.headers.get('content-type') || '',
      }
    } catch (error) {
      lastError = error
      if (attempt < retries) await new Promise((resolve) => setTimeout(resolve, 1500 * attempt))
    }
  }
  throw lastError
}

function sample(urls, extra = []) {
  const blogs = urls.filter((url) => url.includes('/blog/'))
  const services = urls.filter((url) => url.includes('/tr/hizmetler/') || url.includes('/en/services/'))
  return [...new Set([
    ...extra,
    ...urls.slice(0, 8),
    ...blogs.slice(0, 3),
    ...services.slice(0, 3),
    urls.at(-1),
  ].filter(Boolean))]
}

async function verifySitemap(path, locale) {
  const url = `${base}${path}`
  const { status, text, contentType } = await fetchText(url)
  console.log(`${path}: HTTP ${status}`)
  if (!contentType.includes('xml') && !contentType.includes('text')) {
    fail(`${path} content-type is ${contentType || 'missing'}`)
  }
  if (!text.includes('<?xml') || !text.includes('<urlset') || !text.includes('</urlset>')) {
    fail(`${path} is not valid sitemap XML`)
  }
  if (containsForbiddenHost(text)) fail(`${path} contains localhost`)

  const locs = locUrls(text)
  const localhostCount = (text.match(/localhost|127\.0\.0\.1/gi) || []).length
  const enCount = locs.filter((loc) => isEnglishPath(pathnameOf(loc))).length
  const trCount = locs.filter((loc) => isTurkishPath(pathnameOf(loc))).length
  const unprefixedCount = locs.filter((loc) => isUnprefixedTurkishPath(pathnameOf(loc))).length
  const foreignHost = locs.filter((loc) => !loc.startsWith(PRODUCTION_SITE_URL))

  if (locs.length === 0) fail(`${path} has no URLs`)
  if (localhostCount !== 0) fail(`${path} localhost count is ${localhostCount}`)
  if (foreignHost.length) fail(`${path} has non-canonical hosts: ${foreignHost.join(', ')}`)
  if (unprefixedCount !== 0) fail(`${path} contains ${unprefixedCount} unprefixed Turkish loc URLs`)

  if (locale === 'tr') {
    if (enCount !== 0) fail(`${path} contains ${enCount} English loc URLs`)
    if (trCount === 0) fail(`${path} has no Turkish URLs`)
    if (locs.some((loc) => !loc.startsWith(`${PRODUCTION_SITE_URL}/tr`))) {
      fail(`${path} has a loc that is not a /tr URL`)
    }
  } else {
    if (enCount === 0) fail(`${path} has no English /en URLs`)
    if (trCount !== 0) fail(`${path} contains ${trCount} /tr loc URLs`)
    const leaked = locs.some((loc) => isUnprefixedTurkishPath(pathnameOf(loc)) || isTurkishPath(pathnameOf(loc)))
    if (leaked) fail(`${path} leaked Turkish routes`)
    if (locs.some((loc) => !loc.startsWith(`${PRODUCTION_SITE_URL}/en`))) {
      fail(`${path} has a loc that is not an English URL`)
    }
  }

  const blogCount = locs.filter((loc) => (
    locale === 'en' ? loc.includes('/en/blog/') : loc.includes('/tr/blog/')
  )).length

  const checked = sample(locs, locale === 'tr'
    ? [`${PRODUCTION_SITE_URL}/tr`, `${PRODUCTION_SITE_URL}/tr/hakkimizda`, `${PRODUCTION_SITE_URL}/tr/blog`]
    : [`${PRODUCTION_SITE_URL}/en`, `${PRODUCTION_SITE_URL}/en/about`, `${PRODUCTION_SITE_URL}/en/blog`])

  for (const loc of checked) {
    const response = await fetch(loc, {
      redirect: 'manual',
      headers: { 'user-agent': 'ParsMedyaSitemapVerify/1.0' },
      signal: AbortSignal.timeout(timeoutMs),
    })
    if (response.status !== 200) fail(`sample URL ${loc} returned HTTP ${response.status}`)
    else console.log(`  sample 200 ${loc}`)
  }

  return { locs, blogCount, localhostCount, enCount, trCount, unprefixedCount, status }
}

const tr = await verifySitemap('/sitemap.xml', 'tr')
const en = await verifySitemap('/sitemap-en.xml', 'en')
const robots = await fetchText(`${base}/robots.txt`)
console.log(`/robots.txt: HTTP ${robots.status}`)
if (!robots.text.includes('Sitemap: https://parsmedya.net/sitemap.xml')) fail('robots.txt missing Turkish sitemap')
if (!robots.text.includes('Sitemap: https://parsmedya.net/sitemap-en.xml')) fail('robots.txt missing English sitemap')

console.log('\n--- sitemap verification ---')
console.log(`Turkish URL count: ${tr.trCount}`)
console.log(`English URL count: ${en.enCount}`)
console.log(`Unprefixed TR URL count: ${tr.unprefixedCount + en.unprefixedCount}`)
console.log(`localhost URL: ${tr.localhostCount + en.localhostCount}`)
console.log(`Blog TR URL count: ${tr.blogCount}`)
console.log(`Blog EN URL count: ${en.blogCount}`)

if (process.exitCode) process.exit(process.exitCode)
console.log('PASS')
