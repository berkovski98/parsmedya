import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import { getSupabaseConfig, hasSupabaseConfig } from '@/lib/supabase/config'

function withPathname(request: NextRequest, headers: Headers) {
  return NextResponse.next({ request: { headers } })
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  if (pathname === '/tr' || pathname.startsWith('/tr/')) {
    const destination = pathname === '/tr' ? '/' : pathname.slice(3) || '/'
    return NextResponse.redirect(new URL(destination, request.url), 308)
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
