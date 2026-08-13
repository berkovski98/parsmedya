'use client'

export function DeleteButton() {
  return <button type="submit" onClick={(event) => { if (!window.confirm('Bu yazıyı kalıcı olarak silmek istediğinize emin misiniz?')) event.preventDefault() }} className="text-sm font-medium text-destructive hover:underline">Sil</button>
}
