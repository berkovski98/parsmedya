'use client'

import { useCallback, useEffect, useState } from 'react'

type CheckData = {
  currentCommit: string
  latestCommit: string
  updateAvailable: boolean
  latestMessage: string
  latestDate: string
  latestAuthor: string
  currentVersion: string
}

type StatusData = {
  status: 'queued' | 'in_progress' | 'completed'
  conclusion: 'success' | 'failure' | 'cancelled' | null
  phase: 'idle' | 'preparing' | 'build' | 'deploy' | 'restart' | 'health' | 'success' | 'failed'
  runId: number | null
  commit: string
  startedAt: string | null
  completedAt: string | null
  url: string | null
  version: string
  build: string
  currentCommit: string
  previousCommit: string
  nodeVersion: string
}

type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: { code: string; message: string } }

const PHASES = [
  { id: 'preparing', label: 'Hazırlanıyor' },
  { id: 'build', label: 'Build alınıyor' },
  { id: 'deploy', label: 'Sunucuya aktarılıyor' },
  { id: 'restart', label: 'Restart ediliyor' },
  { id: 'health', label: 'Health check' },
  { id: 'success', label: 'Başarılı' },
] as const

const STATUS_LABEL: Record<StatusData['status'], string> = {
  queued: 'Hazırlanıyor',
  in_progress: 'İşlem sürüyor',
  completed: 'Tamamlandı',
}

function resultLabel(status: StatusData) {
  if (status.status !== 'completed') return STATUS_LABEL[status.status]
  if (status.conclusion === 'success') return 'Başarılı'
  if (status.conclusion === 'cancelled') return 'İptal'
  if (status.conclusion === 'failure') return 'Başarısız'
  return 'Tamamlandı'
}

export function UpdatesPanel({
  initialCheck,
  initialStatus,
  initialError = '',
}: {
  initialCheck: CheckData | null
  initialStatus: StatusData | null
  initialError?: string
}) {
  const [check, setCheck] = useState<CheckData | null>(initialCheck)
  const [status, setStatus] = useState<StatusData | null>(initialStatus)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(initialError)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    const [checkRes, statusRes] = await Promise.all([
      fetch('/api/system/update/check', { cache: 'no-store' }),
      fetch('/api/system/update/status', { cache: 'no-store' }),
    ])
    const checkJson = await checkRes.json() as ApiResponse<CheckData>
    const statusJson = await statusRes.json() as ApiResponse<StatusData>
    if (checkJson.ok) setCheck(checkJson.data)
    else setError(checkJson.error.message)
    if (statusJson.ok) setStatus(statusJson.data)
  }, [])

  useEffect(() => {
    const active = status?.status === 'queued' || status?.status === 'in_progress'
    if (!active) return
    const timer = window.setInterval(() => { void load() }, 5000)
    return () => window.clearInterval(timer)
  }, [status?.status, load])

  async function checkUpdates() {
    setBusy(true)
    setError('')
    setMessage('')
    try {
      await load()
      setMessage('GitHub main kontrol edildi.')
    } catch {
      setError('Güncelleme bilgisi alınamadı.')
    } finally {
      setBusy(false)
    }
  }

  async function install() {
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const response = await fetch('/api/system/update/install', { method: 'POST' })
      const json = await response.json() as ApiResponse<{ status: string }>
      if (!json.ok) setError(json.error.message)
      else setMessage('GitHub deployment başlatıldı.')
      await load()
    } catch {
      setError('Güncelleme başlatılamadı.')
    } finally {
      setBusy(false)
    }
  }

  async function rollback() {
    if (!status?.previousCommit) return
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const response = await fetch('/api/system/update/rollback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ commitSha: status.previousCommit }),
      })
      const json = await response.json() as ApiResponse<{ status: string }>
      if (!json.ok) setError(json.error.message)
      else setMessage('Önceki sürüme dönüş başlatıldı.')
      await load()
    } catch {
      setError('Geri alma başlatılamadı.')
    } finally {
      setBusy(false)
    }
  }

  const active = status?.status === 'queued' || status?.status === 'in_progress'
  const phase = status?.phase || 'idle'

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-3xl font-bold">Güncellemeler</h1>
      <p className="mt-2 text-muted-foreground">GitHub Actions üzerinden production build, SFTP dağıtım ve Passenger restart yönetilir. Sunucuda build alınmaz.</p>
      {error && <p role="alert" className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      {message && <p className="mt-6 rounded-lg border border-green-600/30 bg-green-600/10 p-3 text-sm text-green-800">{message}</p>}
      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-bold">Mevcut sürüm</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Sürüm" value={status?.version || check?.currentVersion || '—'} />
            <Row label="Build" value={status?.build || '—'} />
            <Row label="Commit" value={shortSha(status?.currentCommit || check?.currentCommit)} />
            <Row label="Son workflow" value={status ? resultLabel(status) : '—'} />
            <Row label="Son dağıtım" value={formatDate(status?.completedAt || status?.startedAt)} />
            <Row label="Sonuç" value={status?.conclusion || '—'} />
          </dl>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-bold">GitHub main</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Son commit" value={shortSha(check?.latestCommit)} />
            <Row label="Yazar" value={check?.latestAuthor || '—'} />
            <Row label="Tarih" value={formatDate(check?.latestDate)} />
            <Row label="Mesaj" value={check?.latestMessage || '—'} />
            <Row label="Güncelleme" value={check?.updateAvailable ? 'Yeni commit mevcut' : 'Güncel'} />
          </dl>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              disabled={busy}
              onClick={() => void checkUpdates()}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium disabled:opacity-50"
            >
              Güncellemeleri Kontrol Et
            </button>
            <button
              disabled={busy || active || !check?.updateAvailable}
              onClick={() => void install()}
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              Güncellemeyi Kur
            </button>
          </div>
        </div>
      </section>
      <section className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-xl font-bold">Dağıtım durumu</h2>
        <ol className="mt-5 space-y-3">
          {PHASES.map((item, index) => {
            const currentIndex = PHASES.findIndex((phaseItem) => phaseItem.id === phase)
            const failed = status?.status === 'completed' && status.conclusion !== 'success'
            const done = !failed && (phase === 'success' || currentIndex > index)
            const current = !failed && item.id === phase
            return (
              <li key={item.id} className="flex items-center gap-3 text-sm">
                <span className={`h-2.5 w-2.5 rounded-full ${failed && current ? 'bg-destructive' : done ? 'bg-green-600' : current ? 'bg-accent' : 'bg-border'}`} />
                <span className={current ? 'font-medium text-foreground' : 'text-muted-foreground'}>{item.label}</span>
              </li>
            )
          })}
        </ol>
        {status?.url && (
          <p className="mt-4 text-sm">
            <a href={status.url} target="_blank" rel="noreferrer" className="font-medium text-accent hover:underline">
              GitHub Actions kaydı
            </a>
          </p>
        )}
      </section>
      <section className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-xl font-bold">Önceki sürüme dön</h2>
        <p className="mt-2 text-sm text-muted-foreground">ZIP yedek kullanılmaz. Son başarılı commit GitHub Actions ile yeniden derlenir ve dağıtılır.</p>
        <p className="mt-3 text-sm font-medium">{status?.previousCommit ? shortSha(status.previousCommit) : 'Önceki başarılı commit yok.'}</p>
        <button
          disabled={busy || active || !status?.previousCommit}
          onClick={() => void rollback()}
          className="mt-4 rounded-lg border border-border px-4 py-2.5 text-sm font-medium disabled:opacity-50"
        >
          Önceki Sürüme Dön
        </button>
      </section>
    </div>
  )
}

function shortSha(value?: string) {
  if (!value) return '—'
  return value.slice(0, 7)
}

function formatDate(value?: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="max-w-[60%] truncate text-right font-medium" title={value}>{value}</dd>
    </div>
  )
}
