import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateContactPayload } from '@/lib/contact'

const recentSubmissions = new Map<string, number>()
const RATE_LIMIT_MS = 30_000

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (body?.website) return NextResponse.json({ ok: true })
    const startedAt = Number(body?.startedAt)
    if (!Number.isFinite(startedAt) || Date.now() - startedAt < 2_000) {
      return NextResponse.json({ error: 'Lütfen formu kontrol edip tekrar deneyin.' }, { status: 429 })
    }

    const input = validateContactPayload(body)
    const fingerprint = `${input.email}:${input.message.slice(0, 80)}`
    const previous = recentSubmissions.get(fingerprint) || 0
    if (Date.now() - previous < RATE_LIMIT_MS) {
      return NextResponse.json({ error: 'Mesajınız kısa süre önce gönderildi. Lütfen bekleyip tekrar deneyin.' }, { status: 429 })
    }

    const { error } = await (await createClient()).rpc('submit_contact_message', {
      contact_name: input.name,
      contact_email: input.email,
      contact_phone: input.phone,
      contact_company: input.company,
      contact_subject: input.subject,
      contact_message: input.message,
      contact_locale: body?.locale === 'en' ? 'en' : 'tr',
    })
    if (error) throw error
    recentSubmissions.set(fingerprint, Date.now())
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    const code = error instanceof Error ? error.message : ''
    const message = code === 'TOO_LONG'
      ? 'Girdiğiniz bilgiler izin verilen uzunluğu aşıyor.'
      : code === 'INVALID'
        ? 'Lütfen zorunlu alanları ve e-posta adresini kontrol edin.'
        : 'Mesajınız gönderilemedi. Lütfen daha sonra tekrar deneyin.'
    return NextResponse.json({ error: message }, { status: code === 'INVALID' || code === 'TOO_LONG' ? 400 : 500 })
  }
}
