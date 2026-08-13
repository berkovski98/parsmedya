'use client'

export function DeleteContactButton() {
  return <button type="submit" onClick={(event) => { if (!window.confirm('Bu iletişim talebini kalıcı olarak silmek istediğinize emin misiniz? Arşivleme önerilir.')) event.preventDefault() }} className="rounded-lg bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/20">Kalıcı Olarak Sil</button>
}
