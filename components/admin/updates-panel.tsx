'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

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
  phaseLabel: string
  progress: number
  runId: number | null
  commit: string
  startedAt: string | null
  updatedAt: string | null
  completedAt: string | null
  url: string | null
  version: string
  build: string
  currentCommit: string
  previousCommit: string
  nodeVersion: string
  errorMessage: string | null
}

type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: { code: string; message: string } }

const PROGRESS_STEPS = [
  { min: 0, label: 'Sıraya alındı' },
  { min: 5, label: 'Hazırlanıyor' },
  { min: 15, label: 'Bağımlılıklar hazırlanıyor' },
  { min: 30, label: 'Testler çalıştırılıyor' },
  { min: 40, label: 'Build alınıyor' },
  { min: 75, label: 'Sunucuya aktarılıyor' },
  { min: 90, label: 'Restart ediliyor' },
  { min: 95, label: 'Health check' },
  { min: 100, label: 'Tamamlandı' },
] as const

function isActiveStatus(status?: StatusData | null) {
  return status?.status === 'queued' || status?.status === 'in_progress'
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
  const [checking, setChecking] = useState(false)
  const [installing, setInstalling] = useState(false)
  const [trackedRunId, setTrackedRunId] = useState<number | null>(
    isActiveStatus(initialStatus) ? initialStatus?.runId || null : null,
  )
  const installLock = useRef(false)
  const awaitingRun = useRef(false)

  const loadCheck = useCallback(async () => {
    const checkRes = await fetch('/api/system/update/check', { cache: 'no-store' })
    const checkJson = await checkRes.json() as ApiResponse<CheckData>
    if (checkJson.ok) setCheck(checkJson.data)
    else setError(checkJson.error.message)
  }, [])

  const loadStatus = useCallback(async () => {
    const statusRes = await fetch('/api/system/update/status', { cache: 'no-store' })
    const statusJson = await statusRes.json() as ApiResponse<StatusData>
    if (!statusJson.ok) {
      setError(statusJson.error.message)
      return null
    }
    const next = statusJson.data
    setStatus(next)
    if (isActiveStatus(next) && next.runId) {
      setTrackedRunId(next.runId)
      awaitingRun.current = false
    }
    if (next.status === 'completed' && next.conclusion === 'success' && next.runId && next.runId === trackedRunId) {
      void loadCheck()
    }
    if (!isActiveStatus(next) && !awaitingRun.current) {
      setInstalling(false)
      installLock.current = false
    }
    return next
  }, [loadCheck, trackedRunId])

  const polling = isActiveStatus(status) || installing
  useEffect(() => {
    if (!polling) return
    const timer = window.setInterval(() => { void loadStatus() }, 4000)
    return () => window.clearInterval(timer)
  }, [polling, loadStatus])

  async function checkUpdates() {
    setChecking(true)
    setError('')
    setMessage('')
    try {
      await loadCheck()
      setMessage('GitHub main kontrol edildi. Deployment başlatılmadı.')
    } catch {
      setError('Güncelleme bilgisi alınamadı.')
    } finally {
      setChecking(false)
    }
  }

  async function install() {
    if (installLock.current || installing || isActiveStatus(status) || !check?.updateAvailable) return
    if (!window.confirm('Yeni sürüm production ortamına kurulacak. Devam etmek istiyor musunuz?')) return
    installLock.current = true
    setInstalling(true)
    setError('')
    setMessage('')
    try {
      const response = await fetch('/api/system/update/install', { method: 'POST' })
      const json = await response.json() as ApiResponse<{ status: string }>
      if (!json.ok) {
        setError(json.error.message)
        setInstalling(false)
        installLock.current = false
        return
      }
      setMessage('GitHub deployment başlatıldı.')
      awaitingRun.current = true
      await loadStatus()
    } catch {
      setError('Güncelleme başlatılamadı.')
      setInstalling(false)
      installLock.current = false
    }
  }

  async function rollback() {
    if (!status?.previousCommit || installLock.current || isActiveStatus(status)) return
    if (!window.confirm('Önceki başarılı sürüme dönülecek. Devam etmek istiyor musunuz?')) return
    installLock.current = true
    setInstalling(true)
    setError('')
    setMessage('')
    try {
      const response = await fetch('/api/system/update/rollback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ commitSha: status.previousCommit }),
      })
      const json = await response.json() as ApiResponse<{ status: string }>
      if (!json.ok) {
        setError(json.error.message)
        setInstalling(false)
        installLock.current = false
        return
      }
      setMessage('Önceki sürüme dönüş başlatıldı.')
      awaitingRun.current = true
      await loadStatus()
    } catch {
      setError('Geri alma başlatılamadı.')
      setInstalling(false)
      installLock.current = false
    }
  }

  const active = polling
  const showProgress = Boolean(active || (trackedRunId && status && status.runId === trackedRunId))
  const progress = status?.progress ?? 0
  const failed = Boolean(trackedRunId && status?.status === 'completed' && status.conclusion !== 'success' && status.runId === trackedRunId)
  const succeeded = Boolean(trackedRunId && status?.status === 'completed' && status.conclusion === 'success' && status.runId === trackedRunId)

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-3xl font-bold">Güncellemeler</h1>
      <p className="mt-2 text-muted-foreground">Kontrol yalnızca GitHub’ı okur. Production kurulumu yalnız “Güncellemeyi Kur” ile başlar.</p>
      {error && <p role="alert" className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      {message && <p className="mt-6 rounded-lg border border-green-600/30 bg-green-600/10 p-3 text-sm text-green-800">{message}</p>}
      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-bold">Mevcut sürüm</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Sürüm" value={status?.version || check?.currentVersion || '—'} />
            <Row label="Build" value={status?.build || '—'} />
            <Row label="Commit" value={shortSha(status?.currentCommit || check?.currentCommit)} />
            <Row label="Son dağıtım" value={formatDate(status?.completedAt || status?.startedAt)} />
          </dl>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-bold">GitHub main</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Son commit" value={shortSha(check?.latestCommit)} />
            <Row label="Yazar" value={check?.latestAuthor || '—'} />
            <Row label="Tarih" value={formatDate(check?.latestDate)} />
            <Row label="Mesaj" value={check?.latestMessage || '—'} />
            <Row label="Güncelleme" value={check?.updateAvailable ? 'Yeni güncelleme mevcut' : 'Güncel'} />
          </dl>
          {check?.updateAvailable && (
            <p className="mt-3 text-sm text-muted-foreground">
              {shortSha(check.currentCommit)} → {shortSha(check.latestCommit)}
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              disabled={checking || installing}
              onClick={() => void checkUpdates()}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium disabled:opacity-50"
            >
              {checking ? 'Kontrol ediliyor...' : 'Güncellemeleri Kontrol Et'}
            </button>
            <button
              disabled={checking || installing || active || !check?.updateAvailable}
              onClick={() => void install()}
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {installing ? 'Kuruluyor...' : 'Güncellemeyi Kur'}
            </button>
          </div>
        </div>
      </section>

      {showProgress && (
        <section className="mt-8 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-xl font-bold">
              {failed ? 'Güncelleme başarısız' : succeeded ? 'Güncelleme başarıyla tamamlandı' : 'Güncelleme kuruluyor'}
            </h2>
            <span className={`text-lg font-bold ${failed ? 'text-destructive' : succeeded ? 'text-green-700' : 'text-accent'}`}>
              {progress}%
            </span>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-secondary">
            <div
              className={`h-full rounded-full transition-all ${failed ? 'bg-destructive' : succeeded ? 'bg-green-600' : 'bg-accent'}`}
              style={{ width: `${Math.max(0, Math.min(progress, failed ? 95 : 100))}%` }}
            />
          </div>
          <p className="mt-3 text-sm font-medium">
            {failed ? `İşlem %${progress} aşamasında durdu.` : status?.phaseLabel || 'İşlem sıraya alındı'}
          </p>
          {failed && status?.errorMessage && (
            <p className="mt-2 text-sm text-destructive">{status.errorMessage}</p>
          )}
          <ol className="mt-6 space-y-3">
            {PROGRESS_STEPS.map((item, index) => {
              const nextMin = PROGRESS_STEPS[index + 1]?.min ?? 101
              const state = stepVisual(progress, item.min, nextMin, failed, succeeded)
              return (
                <li key={item.label} className={`flex items-center gap-3 text-sm ${state.className}`}>
                  <span className="w-4 text-center">{state.mark}</span>
                  <span>{item.label}</span>
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
      )}

      <section className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-xl font-bold">Önceki sürüme dön</h2>
        <p className="mt-2 text-sm text-muted-foreground">ZIP yedek kullanılmaz. Son başarılı commit GitHub Actions ile yeniden derlenir ve dağıtılır.</p>
        <p className="mt-3 text-sm font-medium">{status?.previousCommit ? shortSha(status.previousCommit) : 'Önceki başarılı commit yok.'}</p>
        <button
          disabled={checking || installing || active || !status?.previousCommit}
          onClick={() => void rollback()}
          className="mt-4 rounded-lg border border-border px-4 py-2.5 text-sm font-medium disabled:opacity-50"
        >
          Önceki Sürüme Dön
        </button>
      </section>
    </div>
  )
}

function stepVisual(progress: number, min: number, nextMin: number, failed: boolean, succeeded: boolean) {
  if (succeeded || (!failed && progress >= nextMin)) {
    return { mark: '✓', className: 'text-green-700' }
  }
  const current = (progress >= min && progress < nextMin) || (progress === 0 && min === 0)
  if (failed && current) {
    return { mark: '✕', className: 'text-destructive' }
  }
  if (!failed && current) {
    return { mark: '→', className: 'font-medium text-accent' }
  }
  if (!failed && progress >= min) {
    return { mark: '✓', className: 'text-green-700' }
  }
  return { mark: '○', className: 'text-muted-foreground' }
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
