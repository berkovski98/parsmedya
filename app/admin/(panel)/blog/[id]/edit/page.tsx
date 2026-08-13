import { notFound } from 'next/navigation'
import { BlogForm } from '@/components/admin/blog-form'
import { createClient } from '@/lib/supabase/server'
import type { BlogPost } from '@/lib/supabase/types'
import { requireAdmin } from '@/lib/supabase/auth'

export default async function EditBlogPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  await requireAdmin()
  const { id } = await params
  const { error } = await searchParams
  const { data } = await (await createClient()).from('blog_posts').select('*').eq('id', id).maybeSingle()
  if (!data) notFound()
  return <div className="mx-auto max-w-5xl"><h1 className="font-display text-3xl font-bold">Blog Yazısını Düzenle</h1><p className="mt-2 text-muted-foreground">İçeriği ve yayın ayarlarını güncelleyin.</p><div className="mt-8 rounded-xl border border-border bg-card p-5 sm:p-7"><BlogForm post={data as BlogPost} error={error} /></div></div>
}
