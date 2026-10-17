import Link from 'next/link'
import { BellRing } from 'lucide-react'
import type { ConversionSummary } from '@/lib/analytics'

const eventLabels: Record<string, string> = {
  whatsapp_click: 'WhatsApp tıklaması',
  phone_click: 'Telefon tıklaması',
  email_click: 'E-posta tıklaması',
  form_submit: 'Form gönderimi',
  session_start: 'Oturum',
}

/** Prominent notice on the dashboard while there are unread contact requests. */
export function NewLeadsAlert({ count }: { count: number }) {
  if (count <= 0) return null
  return (
    <Link href="/admin/contact" className="mt-8 flex items-center gap-4 rounded-xl border border-accent/40 bg-accent/10 p-5 transition-colors hover:bg-accent/15">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"><BellRing className="h-5 w-5" aria-hidden="true" /></span>
      <span>
        <span className="block font-display text-lg font-bold">{count} yeni iletişim talebi bekliyor</span>
        <span className="block text-sm text-muted-foreground">Talepleri açtığınızda durumları otomatik olarak “Okundu” olur.</span>
      </span>
    </Link>
  )
}

export function ConversionSummaryCard({ result }: { result: { ok: true; data: ConversionSummary } | { ok: false; missing: boolean } }) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-xl font-bold">Dönüşümler (son 30 gün)</h2>
        <p className="text-xs text-muted-foreground">WhatsApp, telefon, e-posta tıklamaları ve form gönderimleri</p>
      </div>
      {!result.ok ? (
        <p className="mt-5 rounded-lg bg-secondary/60 p-4 text-sm text-muted-foreground">
          {result.missing
            ? 'Dönüşüm takibi için veritabanı güncellemesi (supabase/migrations/010_conversion_tracking.sql) henüz uygulanmamış. Uygulandığında veriler burada görünür.'
            : 'Dönüşüm verileri alınamadı.'}
        </p>
      ) : (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {(['form_submit', 'whatsapp_click', 'phone_click', 'email_click'] as const).map((key) => (
              <div key={key} className="rounded-lg bg-secondary/60 p-4">
                <p className="text-xs text-muted-foreground">{eventLabels[key]}</p>
                <p className="mt-1 font-display text-2xl font-bold">{result.data.events[key] || 0}</p>
              </div>
            ))}
            <div className="rounded-lg bg-secondary/60 p-4">
              <p className="text-xs text-muted-foreground">Kayıtlı form talebi</p>
              <p className="mt-1 font-display text-2xl font-bold">{result.data.contact_messages}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="font-display font-semibold">Kaynağa göre</h3>
              <table className="mt-3 w-full text-sm">
                <thead><tr className="text-left text-xs text-muted-foreground"><th className="py-2 font-medium">Kaynak</th><th className="py-2 text-right font-medium">Oturum</th><th className="py-2 text-right font-medium">Dönüşen oturum</th></tr></thead>
                <tbody className="divide-y divide-border">
                  {result.data.sources.map((row) => <tr key={row.source}><td className="py-2">{row.source === 'direct' ? 'Doğrudan' : row.source}</td><td className="py-2 text-right tabular-nums">{row.sessions}</td><td className="py-2 text-right tabular-nums">{row.conversions}</td></tr>)}
                  {result.data.sources.length === 0 && <tr><td colSpan={3} className="py-3 text-muted-foreground">Henüz veri yok.</td></tr>}
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="font-display font-semibold">Tıklanan yer</h3>
              <table className="mt-3 w-full text-sm">
                <thead><tr className="text-left text-xs text-muted-foreground"><th className="py-2 font-medium">Olay</th><th className="py-2 font-medium">Konum</th><th className="py-2 text-right font-medium">Adet</th></tr></thead>
                <tbody className="divide-y divide-border">
                  {result.data.targets.map((row) => <tr key={`${row.event}-${row.target}`}><td className="py-2">{eventLabels[row.event] || row.event}</td><td className="py-2 text-muted-foreground">{row.target}</td><td className="py-2 text-right tabular-nums">{row.total}</td></tr>)}
                  {result.data.targets.length === 0 && <tr><td colSpan={3} className="py-3 text-muted-foreground">Henüz veri yok.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
