import { NextResponse } from 'next/server'
import { isAnalyticsEnabled, reportAnalyticsEnvPresence } from '@/lib/analytics-config'
import { allowAnalyticsRequest } from '@/lib/analytics-rate-limit'
import { isBotUserAgent, validateAnalyticsPayload, validateSiteEventPayload } from '@/lib/analytics-validation'
import { isMissingFunctionError } from '@/lib/site-events'
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

    const eventName = (rawPayload as { event?: unknown } | null)?.event
    if (eventName !== undefined && eventName !== 'page_view') return recordSiteEvent(rawPayload)

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

async function recordSiteEvent(rawPayload: unknown) {
  const payload = validateSiteEventPayload(rawPayload)
  if (!payload) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  if (!allowAnalyticsRequest(`${payload.visitorId}:${payload.event}`)) return new NextResponse(null, { status: 204 })
  if (!hasSupabaseConfig()) return new NextResponse(null, { status: 204 })

  const { error } = await createPublicSupabaseClient().rpc('record_site_event', {
    event_name: payload.event,
    event_path: payload.path,
    event_visitor_id: payload.visitorId,
    event_session_id: payload.sessionId,
    event_locale: payload.locale,
    event_target: payload.target || null,
    event_referrer: payload.referrer || null,
    event_utm_source: payload.utmSource || null,
    event_utm_medium: payload.utmMedium || null,
    event_utm_campaign: payload.utmCampaign || null,
  })
  if (error) {
    // Until migration 010 is applied the function does not exist; skip quietly instead of erroring.
    if (isMissingFunctionError(error)) return new NextResponse(null, { status: 204 })
    console.error(JSON.stringify({ event: 'site_event_insert_failed', code: error.code, message: error.message }))
    return NextResponse.json({ error: 'Unable to record event', code: error.code }, { status: 503 })
  }
  return new NextResponse(null, { status: 204 })
}
