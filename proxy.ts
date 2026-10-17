import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import { isValidEnLocalPath } from '@/lib/local-seo/en-resolve'
import { isValidLocalPath } from '@/lib/local-seo/resolve'
import { getSupabaseConfig, hasSupabaseConfig } from '@/lib/supabase/config'

const reservedPrefixes = new Set([
  'hizmetler', 'blog', 'hakkimizda', 'iletisim', 'misyonumuz', 'vizyonumuz', 'hizmet-bolgeleri',
  'en', 'admin', 'api', 'tr', 'sitemaps', 'geo', '_next',
  // Legal and reference pages (new routes; keep in sync with RESERVED_TR_CITY_SEGMENTS).
  'kvkk-aydinlatma-metni', 'gizlilik-politikasi', 'cerez-politikasi', 'kullanim-kosullari', 'referanslar',
])

const CANONICAL_HOST = 'parsmedya.net'

/** www.parsmedya.net → https://parsmedya.net (same path and query), one 301 hop. */
function redirectWwwHost(request: NextRequest, pathname: string) {
  const host = (request.headers.get('x-forwarded-host') || request.headers.get('host') || '').split(',')[0].trim().toLowerCase()
  if (host !== `www.${CANONICAL_HOST}` && !host.startsWith(`www.${CANONICAL_HOST}:`)) return null
  const trimmed = pathname.length > 1 ? pathname.replace(/\/+$/, '') || '/' : pathname
  const target = trimmed === '/tr' || trimmed.startsWith('/tr/') ? trimmed.slice(3) || '/' : trimmed
  return NextResponse.redirect(`https://${CANONICAL_HOST}${target}${request.nextUrl.search}`, 301)
}

function withPathname(request: NextRequest, headers: Headers) {
  return NextResponse.next({ request: { headers } })
}

function rewriteLocalSeo(request: NextRequest, pathname: string) {
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length < 1 || parts.length > 3) return null
  const city = parts[0]
  if (!city || reservedPrefixes.has(city) || city.includes('.')) return null
  // Unknown city/district/service: do not rewrite. The request then falls through to the normal
  // router and gets the server-rendered 404 page with a real 404 status, instead of an empty
  // error shell from notFound() inside /geo (Next.js recommends this check in proxy).
  if (!isValidLocalPath(pathname)) return null
  const url = request.nextUrl.clone()
  url.pathname = `/geo${pathname}`
  return NextResponse.rewrite(url)
}

/** Unknown /en/service-areas/... and /hizmet-bolgeleri/... paths → server-rendered 404 page. */
function rewriteMissingLocalHub(request: NextRequest, pathname: string, headers: Headers) {
  const english = pathname.startsWith('/en/service-areas/')
  const turkish = pathname.startsWith('/hizmet-bolgeleri/')
  if (!english && !turkish) return null
  if (english ? isValidEnLocalPath(pathname) : isValidLocalPath(pathname)) return null
  const url = request.nextUrl.clone()
  url.pathname = english ? '/en/__not-found' : '/__not-found'
  return NextResponse.rewrite(url, { request: { headers } })
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  const wwwRedirect = redirectWwwHost(request, pathname)
  if (wwwRedirect) return wwwRedirect

  // Trailing slash and legacy /tr prefix are removed in a single 308 (skipTrailingSlashRedirect
  // in next.config hands trailing slashes to this proxy instead of Next's own extra hop).
  if (pathname.length > 1 && pathname.endsWith('/')) {
    const trimmed = pathname.replace(/\/+$/, '') || '/'
    const destination = trimmed === '/tr' ? '/' : trimmed.startsWith('/tr/') ? trimmed.slice(3) : trimmed
    return NextResponse.redirect(new URL(`${destination}${request.nextUrl.search}`, request.url), 308)
  }

  if (pathname === '/tr' || pathname.startsWith('/tr/')) {
    const destination = pathname === '/tr' ? '/' : pathname.slice(3) || '/'
    return NextResponse.redirect(new URL(destination, request.url), 308)
  }

  const localSeo = rewriteLocalSeo(request, pathname)
  if (localSeo) return localSeo

  const missingHub = rewriteMissingLocalHub(request, pathname, requestHeaders)
  if (missingHub) return missingHub

  // /geo/* is the internal rewrite target of the local pages; when requested directly it
  // must not compete with the public URLs (/istanbul, …), which carry the canonical.
  if (pathname === '/geo' || pathname.startsWith('/geo/')) {
    const response = withPathname(request, requestHeaders)
    response.headers.set('X-Robots-Tag', 'noindex, follow')
    return response
  }

  const passthrough = () => withPathname(request, requestHeaders)
  try {
    if (!hasSupabaseConfig()) return passthrough()

    const { url, anonKey } = getSupabaseConfig()
    let response = passthrough()
    const supabase = createServerClient(
      url,
      anonKey,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            response = passthrough()
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
          },
        },
      },
    )
    await supabase.auth.getUser()
    return response
  } catch (error) {
    console.error('[proxy] request failed; continuing without auth session', error)
    return passthrough()
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
