import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BlogForm } from '@/components/admin/blog-form'
import { createClient } from '@/lib/supabase/server'
import type { BlogPost } from '@/lib/supabase/types'
import { requireAdmin } from '@/lib/supabase/auth'

export default async function EditBlogPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  await requireAdmin()
  const { id } = await params
  const { error } = await searchParams
  const supabase = await createClient()
  const { data } = await supabase.from('blog_posts').select('*').eq('id', id).maybeSingle()
  if (!data) notFound()
  const post = data as BlogPost
  const { data: linked } = post.translation_group_id ? await supabase.from('blog_posts').select('id,title,locale').eq('translation_group_id', post.translation_group_id).neq('id', id).maybeSingle() : { data: null }
  return <div className="mx-auto max-w-5xl"><h1 className="font-display text-3xl font-bold">Blog Yazısını Düzenle</h1><p className="mt-2 text-muted-foreground">İçeriği ve yayın ayarlarını güncelleyin.</p>{linked ? <div className="mt-5 rounded-lg border border-border bg-card p-4 text-sm"><span className="text-muted-foreground">Bağlı Çeviri: </span><Link href={`/admin/blog/${linked.id}/edit`} className="font-medium text-accent hover:underline">{linked.locale === 'en' ? 'English version' : 'Türkçe karşılığı'}: {linked.title}</Link></div> : <div className="mt-5"><Link href={`/admin/blog/new?translateFrom=${post.id}`} className="text-sm font-medium text-accent hover:underline">{post.locale === 'tr' ? 'İngilizce Versiyon Oluştur' : 'Türkçe Versiyon Oluştur'}</Link></div>}<div className="mt-8 rounded-xl border border-border bg-card p-5 sm:p-7"><BlogForm post={post} error={error} /></div></div>
}
