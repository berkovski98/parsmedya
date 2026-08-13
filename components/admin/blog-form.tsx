'use client'

import { useState } from 'react'
import { savePost } from '@/app/admin/actions'
import type { BlogPost } from '@/lib/supabase/types'

const slugify = (value: string) => value.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const input = 'mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20'

export function BlogForm({ post, error, initialLocale = 'tr', translationSource }: { post?: BlogPost; error?: string; initialLocale?: BlogPost['locale']; translationSource?: BlogPost }) {
  const startingLocale = post?.locale || (translationSource?.locale === 'tr' ? 'en' : translationSource?.locale === 'en' ? 'tr' : initialLocale)
  const [locale, setLocale] = useState<BlogPost['locale']>(startingLocale)
  const [slug, setSlug] = useState(post?.slug || '')
  const [edited, setEdited] = useState(Boolean(post))
  const [seoTitle, setSeoTitle] = useState(post?.seo_title || '')
  const [seoDescription, setSeoDescription] = useState(post?.seo_description || '')
  return <form action={savePost} className="space-y-6">
    <input type="hidden" name="id" value={post?.id || ''} /><input type="hidden" name="current_image_url" value={post?.image_url || translationSource?.image_url || ''} />
    {translationSource && <input type="hidden" name="translation_source_id" value={translationSource.id} />}
    {translationSource && <input type="hidden" name="locale" value={startingLocale} />}
    {post && <input type="hidden" name="locale" value={post.locale} />}
    {post?.translation_group_id && <input type="hidden" name="translation_group_id" value={post.translation_group_id} />}
    {error && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
    {translationSource && <p className="rounded-lg border border-accent/30 bg-accent/10 p-3 text-sm">“{translationSource.title}” yazısının {startingLocale === 'en' ? 'İngilizce' : 'Türkçe'} versiyonunu oluşturuyorsunuz. Metin ve SEO alanlarını manuel olarak doldurun.</p>}
    <div className="grid gap-5 lg:grid-cols-2">
      <label className="text-sm font-medium">Dil *<select name={post ? undefined : 'locale'} value={locale} disabled={Boolean(post || translationSource)} onChange={(event) => { setLocale(event.target.value as BlogPost['locale']); if (!edited) setSlug('') }} className={input}><option value="tr">Türkçe</option><option value="en">English</option></select>{post && <span className="mt-1 block text-xs font-normal text-muted-foreground">URL ve çeviri ilişkisini korumak için düzenleme sırasında dil değiştirilemez.</span>}</label>
      {(post?.translation_group_id || translationSource) && <label className="text-sm font-medium">Çeviri bağlantısı<input readOnly value={post?.translation_group_id || 'Kaydedildiğinde otomatik oluşturulacak'} className={`${input} text-muted-foreground`} /></label>}
      <label className="text-sm font-medium">Başlık *<input required name="title" defaultValue={post?.title} className={input} onChange={(event) => { if (!edited) setSlug(slugify(event.target.value)) }} /></label>
      <label className="text-sm font-medium">Slug *<input required name="slug" value={slug} className={input} onChange={(event) => { setEdited(true); setSlug(slugify(event.target.value)) }} /></label>
      <label className="text-sm font-medium">Kategori *<input required name="category" defaultValue={post?.category} className={input} /></label>
      <label className="text-sm font-medium">Yazar *<input required name="author" defaultValue={post?.author || (locale === 'en' ? 'Pars Medya Team' : 'Pars Medya Ekibi')} className={input} /></label>
    </div>
    <label className="block text-sm font-medium">Kısa açıklama *<textarea required name="excerpt" defaultValue={post?.excerpt} rows={3} className={input} /></label>
    <label className="block text-sm font-medium">İçerik *<span className="ml-2 font-normal text-muted-foreground">Başlıklar için ## kullanabilirsiniz.</span><textarea required name="content" defaultValue={post?.content} rows={16} className={input} /></label>
    <div className="grid gap-5 lg:grid-cols-2">
      <label className="text-sm font-medium">Kapak görseli<input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className={input} /><span className="mt-1 block text-xs font-normal text-muted-foreground">JPG, PNG, WebP veya GIF — en fazla 5 MB</span></label>
      <label className="text-sm font-medium">Yayın tarihi<input name="published_at" type="datetime-local" defaultValue={post?.published_at?.slice(0, 16)} className={input} /></label>
      <label className="text-sm font-medium">SEO Başlığı<input name="seo_title" value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} className={input} /><span className="mt-1 block text-right text-xs font-normal text-muted-foreground">{seoTitle.length} karakter</span></label>
      <label className="text-sm font-medium">Meta Açıklaması<textarea name="seo_description" value={seoDescription} onChange={(event) => setSeoDescription(event.target.value)} rows={2} className={input} /><span className="mt-1 block text-right text-xs font-normal text-muted-foreground">{seoDescription.length} karakter · önerilen yaklaşık 150–160</span></label>
      <label className="text-sm font-medium">Durum<select name="status" defaultValue={post?.status || 'draft'} className={input}><option value="draft">Taslak</option><option value="published">Yayında</option></select></label>
    </div>
    <button className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">{post ? 'Değişiklikleri Kaydet' : 'Yazıyı Oluştur'}</button>
  </form>
}
