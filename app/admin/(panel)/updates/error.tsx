'use client'

export default function UpdatesError({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-8">
      <h1 className="font-display text-2xl font-bold">Güncellemeler yüklenemedi</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        GitHub veya sunucu bilgisi alınırken bir hata oluştu. Sayfa çökmeden yeniden denenebilir.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
      >
        Yeniden dene
      </button>
    </div>
  )
}
