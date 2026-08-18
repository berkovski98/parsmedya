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

function isPrefixedTurkishPath(pathname) {
  return pathname === '/tr' || pathname.startsWith('/tr/')
}

function isCanonicalTurkishPath(pathname) {
  if (isEnglishPath(pathname) || isPrefixedTurkishPath(pathname)) return false
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return false
  if (pathname === '/api' || pathname.startsWith('/api/')) return false
  if (pathname === '/sitemaps' || pathname.startsWith('/sitemaps/')) return false
  return true
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

function locForFetch(loc) {
  if (base === PRODUCTION_SITE_URL) return loc
  if (loc === PRODUCTION_SITE_URL || loc.startsWith(`${PRODUCTION_SITE_URL}/`)) {
    return `${base}${loc.slice(PRODUCTION_SITE_URL.length) || '/'}`
  }
  return loc
}

function sample(urls, extra = []) {
  const blogs = urls.filter((url) => url.includes('/blog/'))
  const services = urls.filter((url) => url.includes('/hizmetler/') || url.includes('/en/services/'))
  const local = urls.filter((url) => {
    const pathname = pathnameOf(url)
    return /^\/[a-z0-9-]+\/[a-z0-9-]+/.test(pathname)
      && !pathname.startsWith('/en/')
      && !pathname.startsWith('/hizmetler/')
      && !pathname.startsWith('/blog/')
  })
  return [...new Set([
    ...extra,
    ...urls.slice(0, 8),
    ...blogs.slice(0, 3),
    ...services.slice(0, 3),
    ...local.slice(0, 3),
    urls.at(-1),
  ].filter(Boolean))]
}

function assertUrlset(path, text, contentType) {
  if (!contentType.includes('xml') && !contentType.includes('text')) {
    fail(`${path} content-type is ${contentType || 'missing'}`)
  }
  if (!text.includes('<?xml') || !text.includes('<urlset') || !text.includes('</urlset>')) {
    fail(`${path} is not valid sitemap XML`)
  }
  if (containsForbiddenHost(text)) fail(`${path} contains localhost`)
}

async function verifySitemap(path, locale) {
  const url = `${base}${path}`
  const { status, text, contentType } = await fetchText(url)
  console.log(`${path}: HTTP ${status}`)
  assertUrlset(path, text, contentType)

  const locs = locUrls(text)
  const localhostCount = (text.match(/localhost|127\.0\.0\.1/gi) || []).length
  const enCount = locs.filter((loc) => isEnglishPath(pathnameOf(loc))).length
  const prefixedCount = locs.filter((loc) => isPrefixedTurkishPath(pathnameOf(loc))).length
  const trCount = locs.filter((loc) => isCanonicalTurkishPath(pathnameOf(loc))).length
  const foreignHost = locs.filter((loc) => loc !== PRODUCTION_SITE_URL && !loc.startsWith(`${PRODUCTION_SITE_URL}/`))

  if (locs.length === 0) fail(`${path} has no URLs`)
  if (localhostCount !== 0) fail(`${path} localhost count is ${localhostCount}`)
  if (foreignHost.length) fail(`${path} has non-canonical hosts: ${foreignHost.join(', ')}`)
  if (/undefined|null/i.test(text)) fail(`${path} contains undefined/null`)

  if (locale === 'tr') {
    if (enCount !== 0) fail(`${path} contains ${enCount} English loc URLs`)
    if (prefixedCount !== 0) fail(`${path} contains ${prefixedCount} /tr loc URLs`)
    if (trCount === 0) fail(`${path} has no Turkish URLs`)
    if (locs.some((loc) => !isCanonicalTurkishPath(pathnameOf(loc)))) {
      fail(`${path} has a loc that is not an unprefixed Turkish URL`)
    }
  } else {
    if (enCount === 0) fail(`${path} has no English /en URLs`)
    if (trCount !== 0) fail(`${path} contains ${trCount} unprefixed Turkish loc URLs`)
    if (prefixedCount !== 0) fail(`${path} contains ${prefixedCount} /tr loc URLs`)
    if (locs.some((loc) => !isEnglishPath(pathnameOf(loc)))) fail(`${path} leaked Turkish routes`)
    if (locs.some((loc) => !loc.startsWith(`${PRODUCTION_SITE_URL}/en`))) {
      fail(`${path} has a loc that is not an English URL`)
    }
  }

  const blogCount = locs.filter((loc) => (
    locale === 'en' ? loc.includes('/en/blog/') : loc.includes('/blog/') && !loc.includes('/en/blog/')
  )).length

  const checked = sample(locs, locale === 'tr'
    ? [PRODUCTION_SITE_URL, `${PRODUCTION_SITE_URL}/hakkimizda`, `${PRODUCTION_SITE_URL}/blog`]
    : [`${PRODUCTION_SITE_URL}/en`, `${PRODUCTION_SITE_URL}/en/about`, `${PRODUCTION_SITE_URL}/en/blog`])

  for (const loc of checked) {
    const response = await fetch(locForFetch(loc), {
      redirect: 'manual',
      headers: { 'user-agent': 'ParsMedyaSitemapVerify/1.0' },
      signal: AbortSignal.timeout(timeoutMs),
    })
    if (response.status !== 200) fail(`sample URL ${loc} returned HTTP ${response.status}`)
    else console.log(`  sample 200 ${loc}`)
  }

  return { locs, blogCount, localhostCount, enCount, trCount, prefixedCount, status }
}

async function verifyIndex() {
  const path = '/sitemap.xml'
  const { status, text, contentType } = await fetchText(`${base}${path}`)
  console.log(`${path}: HTTP ${status}`)
  if (!contentType.includes('xml') && !contentType.includes('text')) {
    fail(`${path} content-type is ${contentType || 'missing'}`)
  }
  if (!text.includes('<sitemapindex') || !text.includes('</sitemapindex>')) {
    fail(`${path} is not a sitemap index`)
  }
  if (text.includes('<urlset')) fail(`${path} mixed urlset into sitemap index`)
  if (containsForbiddenHost(text)) fail(`${path} contains localhost`)
  if (/undefined|null/i.test(text)) fail(`${path} contains undefined/null`)
  const children = locUrls(text)
  if (!children.length) fail(`${path} has no child sitemaps`)
  if (children.some((loc) => !loc.startsWith(`${PRODUCTION_SITE_URL}/sitemaps/`))) {
    fail(`${path} has a child loc outside /sitemaps/`)
  }
  const required = [
    `${PRODUCTION_SITE_URL}/sitemaps/tr-pages.xml`,
    `${PRODUCTION_SITE_URL}/sitemaps/en-pages.xml`,
    `${PRODUCTION_SITE_URL}/sitemaps/local-cities.xml`,
  ]
  for (const loc of required) {
    if (!children.includes(loc)) fail(`${path} missing ${loc}`)
  }
  const sampleChildren = children.filter((loc) => (
    loc.includes('tr-pages') || loc.includes('en-pages') || loc.includes('local-cities') || loc.includes('local-services-1')
  ))
  let trCount = 0
  let enCount = 0
  for (const child of sampleChildren) {
    const childPath = pathnameOf(child)
    const locale = child.includes('/sitemaps/en-') ? 'en' : 'tr'
    const result = await verifySitemap(childPath, locale)
    if (locale === 'tr') trCount += result.trCount
    else enCount += result.enCount
  }
  return { children, trCount, enCount }
}

const index = await verifyIndex()
const en = await verifySitemap('/sitemap-en.xml', 'en')
const robots = await fetchText(`${base}/robots.txt`)
console.log(`/robots.txt: HTTP ${robots.status}`)
if (!robots.text.includes('Sitemap: https://parsmedya.net/sitemap.xml')) fail('robots.txt missing Turkish sitemap')
if (!robots.text.includes('Sitemap: https://parsmedya.net/sitemap-en.xml')) fail('robots.txt missing English sitemap')

console.log('\n--- sitemap verification ---')
console.log(`Index child count: ${index.children.length}`)
console.log(`Sampled Turkish URL count: ${index.trCount}`)
console.log(`English URL count: ${en.enCount}`)
console.log(`localhost URL: ${en.localhostCount}`)
console.log(`Blog EN URL count: ${en.blogCount}`)

if (process.exitCode) process.exit(process.exitCode)
console.log('PASS')
