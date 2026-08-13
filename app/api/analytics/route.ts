import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isBotUserAgent, validateAnalyticsPayload } from '@/lib/analytics-validation'

export async function POST(request: Request) {
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== 'true') {
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

  const { error } = await (await createClient()).rpc('record_page_view', {
    view_path: payload.path,
    view_visitor_id: payload.visitorId,
    view_session_id: payload.sessionId,
    view_referrer: payload.referrer || null,
    view_user_agent: userAgent.slice(0, 500),
  })

  if (error) return NextResponse.json({ error: 'Unable to record analytics' }, { status: 503 })
  return new NextResponse(null, { status: 204 })
}
