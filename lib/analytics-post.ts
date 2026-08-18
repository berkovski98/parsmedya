import { NextResponse } from 'next/server'
import { isAnalyticsEnabled, reportAnalyticsEnvPresence } from '@/lib/analytics-config'
import { allowAnalyticsRequest } from '@/lib/analytics-rate-limit'
import { isBotUserAgent, validateAnalyticsPayload } from '@/lib/analytics-validation'
import { hasSupabaseConfig } from '@/lib/supabase/config'
import { createPublicSupabaseClient } from '@/lib/supabase/public'

export async function recordAnalyticsPost(request: Request) {
  try {
    if (!isAnalyticsEnabled()) {
      return new NextResponse(null, { status: 204 })
    }

    const userAgent = request.headers.get('user-agent') || ''
    if (isBotUserAgent(userAgent)) {
      return NextResponse.json({ error: 'Not accepted' }, { status: 403 })
    }

    let rawPayload: unknown
    try {
      if (!request.headers.get('content-type')?.includes('application/json')) throw new Error()
      rawPayload = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const payload = validateAnalyticsPayload(rawPayload)
    if (!payload) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })

    if (!allowAnalyticsRequest(payload.visitorId)) {
      return new NextResponse(null, { status: 204 })
    }

    if (!hasSupabaseConfig()) {
      console.error(JSON.stringify({
        event: 'analytics_insert_failed',
        code: 'MISSING_SUPABASE_ENV',
        env: reportAnalyticsEnvPresence(),
      }))
      return NextResponse.json({ error: 'Unable to record analytics', code: 'MISSING_SUPABASE_ENV' }, { status: 503 })
    }

    const { error } = await createPublicSupabaseClient().rpc('record_page_view', {
      view_path: payload.path,
      view_visitor_id: payload.visitorId,
      view_session_id: payload.sessionId,
      view_referrer: payload.referrer || null,
      view_user_agent: userAgent.slice(0, 500),
      view_locale: payload.locale,
    })

    if (error) {
      console.error(JSON.stringify({ event: 'analytics_insert_failed', code: error.code, message: error.message }))
      return NextResponse.json(
        { error: 'Unable to record analytics', code: error.code },
        { status: 503 },
      )
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error(JSON.stringify({
      event: 'analytics_insert_failed',
      code: 'EXCEPTION',
      message: error instanceof Error ? error.message : 'unknown',
    }))
    return NextResponse.json({ error: 'Unable to record analytics', code: 'EXCEPTION' }, { status: 503 })
  }
}
