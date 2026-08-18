import { NextResponse } from 'next/server'
import { UpdateError } from './errors'

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status })
}

export function fail(error: unknown) {
  if (error instanceof UpdateError) {
    return NextResponse.json(
      { ok: false, error: { code: error.code, message: error.message } },
      { status: error.status },
    )
  }

  return NextResponse.json(
    { ok: false, error: { code: 'UPDATE_FAILED', message: 'Güncelleme uygulanamadı.' } },
    { status: 500 },
  )
}
