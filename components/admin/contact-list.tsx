'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { ContactMessage, ContactStatus } from '@/lib/contact'
import { contactStatusLabels } from '@/lib/contact'
import { cn } from '@/lib/utils'

const statuses: Array<{ value: 'all' | ContactStatus; label: string }> = [
  { value: 'all', label: 'Tümü' }, { value: 'new', label: 'Yeni' },
  { value: 'read', label: 'Okundu' }, { value: 'replied', label: 'Yanıtlandı' },
  { value: 'archived', label: 'Arşivlendi' },
]

export function StatusBadge({ status }: { status: ContactStatus }) {
  return <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-semibold', status === 'new' && 'bg-accent/15 text-accent', status === 'read' && 'bg-blue-500/10 text-blue-700', status === 'replied' && 'bg-emerald-500/10 text-emerald-700', status === 'archived' && 'bg-secondary text-muted-foreground')}>{contactStatusLabels[status]}</span>
}

export function ContactList({ messages }: { messages: ContactMessage[] }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | ContactStatus>('all')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const filtered = useMemo(() => messages.filter((item) => {
    const haystack = [item.name, item.email, item.phone, item.company, item.subject].filter(Boolean).join(' ').toLocaleLowerCase('tr-TR')
    const date = item.created_at.slice(0, 10)
    return (!query || haystack.includes(query.toLocaleLowerCase('tr-TR'))) && (status === 'all' || item.status === status) && (!from || date >= from) && (!to || date <= to)
  }), [messages, query, status, from, to])

  return <><div className="mt-6 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="İsim, e-posta, telefon, firma veya konu ara" className="rounded-lg border border-input bg-background px-3 py-2 text-sm lg:col-span-2" /><select value={status} onChange={(event) => setStatus(event.target.value as 'all' | ContactStatus)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">{statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select><div className="grid grid-cols-2 gap-2"><input aria-label="Başlangıç tarihi" type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="min-w-0 rounded-lg border border-input bg-background px-2 py-2 text-sm" /><input aria-label="Bitiş tarihi" type="date" value={to} onChange={(event) => setTo(event.target.value)} className="min-w-0 rounded-lg border border-input bg-background px-2 py-2 text-sm" /></div></div><p className="mt-4 text-sm text-muted-foreground">{filtered.length} talep gösteriliyor</p><div className="mt-3 grid gap-4 lg:hidden">{filtered.map((item) => <article key={item.id} className="rounded-xl border border-border bg-card p-5"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="truncate font-display font-semibold">{item.name}</h2><p className="mt-1 truncate text-sm text-muted-foreground">{item.email}</p></div><StatusBadge status={item.status} /></div><dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-muted-foreground">Firma</dt><dd>{item.company || '—'}</dd></div><div><dt className="text-muted-foreground">Telefon</dt><dd>{item.phone || '—'}</dd></div><div className="col-span-2"><dt className="text-muted-foreground">Konu</dt><dd>{item.subject || 'Genel iletişim'}</dd></div></dl><div className="mt-4 flex items-center justify-between border-t border-border pt-4"><time className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleString('tr-TR')}</time><Link href={`/admin/contact/${item.id}`} className="text-sm font-semibold text-accent">İncele</Link></div></article>)}</div><div className="mt-3 hidden overflow-hidden rounded-xl border border-border bg-card lg:block"><table className="w-full text-left text-sm"><thead className="bg-secondary/60"><tr>{['Durum','İsim','E-posta','Telefon','Firma','Konu','Tarih','İşlem'].map((heading) => <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>)}</tr></thead><tbody className="divide-y divide-border">{filtered.map((item) => <tr key={item.id}><td className="px-4 py-3"><StatusBadge status={item.status} /></td><td className="max-w-40 truncate px-4 py-3 font-medium">{item.name}</td><td className="max-w-48 truncate px-4 py-3">{item.email}</td><td className="px-4 py-3">{item.phone || '—'}</td><td className="max-w-36 truncate px-4 py-3">{item.company || '—'}</td><td className="max-w-48 truncate px-4 py-3">{item.subject || 'Genel iletişim'}</td><td className="whitespace-nowrap px-4 py-3">{new Date(item.created_at).toLocaleDateString('tr-TR')}</td><td className="px-4 py-3"><Link href={`/admin/contact/${item.id}`} className="font-semibold text-accent">İncele</Link></td></tr>)}</tbody></table></div>{filtered.length === 0 && <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Filtrelerle eşleşen iletişim talebi bulunamadı.</p>}</>
}
