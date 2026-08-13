'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/auth'
import { hasSupabaseConfig } from '@/lib/supabase/config'
import type { BlogPostInput, BlogStatus } from '@/lib/supabase/types'

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const maxSize = 5 * 1024 * 1024
const safeMessage = (message: string) => encodeURIComponent(message)

export async function login(formData: FormData) {
  if (!hasSupabaseConfig()) redirect('/admin/login?error=' + safeMessage('Supabase environment değişkenleri eksik.'))
  const supabase = await createClient()
  const email = String(formData.get('email') || '')
  const password = String(formData.get('password') || '')
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) redirect('/admin/login?error=' + safeMessage('E-posta veya şifre hatalı.'))
  const { data: admin } = await supabase.from('admin_users').select('user_id').maybeSingle()
  if (!admin) {
    await supabase.auth.signOut()
    redirect('/admin/login?error=' + safeMessage('Bu hesabın admin yetkisi bulunmuyor.'))
  }
  redirect('/admin')
}

export async function logout() {
  if (hasSupabaseConfig()) (await createClient()).auth.signOut()
  redirect('/admin/login')
}

function toPostInput(formData: FormData, imageUrl: string): BlogPostInput {
  const status = String(formData.get('status')) as BlogStatus
  const published = String(formData.get('published_at') || '')
  return {
    title: String(formData.get('title') || '').trim(),
    slug: String(formData.get('slug') || '').trim(),
    excerpt: String(formData.get('excerpt') || '').trim(),
    content: String(formData.get('content') || '').trim(),
    image_url: imageUrl,
    category: String(formData.get('category') || '').trim(),
    author: String(formData.get('author') || '').trim(),
    seo_title: String(formData.get('seo_title') || '').trim() || null,
    seo_description: String(formData.get('seo_description') || '').trim() || null,
    status: status === 'published' ? 'published' : 'draft',
    published_at: published ? new Date(published).toISOString() : null,
  }
}

async function uploadImage(file: File, currentUrl: string) {
  if (!file.size) return currentUrl
  if (!allowedTypes.includes(file.type)) throw new Error('Yalnız JPG, PNG, WebP veya GIF yükleyebilirsiniz.')
  if (file.size > maxSize) throw new Error('Görsel boyutu en fazla 5 MB olabilir.')
  const supabase = await createClient()
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${crypto.randomUUID()}.${extension}`
  const { error } = await supabase.storage.from('blog-images').upload(path, file, { contentType: file.type, upsert: false })
  if (error) throw new Error('Görsel yüklenemedi. Lütfen tekrar deneyin.')
  return supabase.storage.from('blog-images').getPublicUrl(path).data.publicUrl
}

export async function savePost(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  const returnPath = id ? `/admin/blog/${id}/edit` : '/admin/blog/new'
  try {
    const imageUrl = await uploadImage(formData.get('image') as File, String(formData.get('current_image_url') || ''))
    const post = toPostInput(formData, imageUrl)
    if (!post.title || !post.slug || !post.excerpt || !post.content || !post.category || !post.author) throw new Error('Zorunlu alanları doldurun.')
    const supabase = await createClient()
    const result = id ? await supabase.from('blog_posts').update(post).eq('id', id) : await supabase.from('blog_posts').insert(post)
    if (result.error) throw new Error(result.error.code === '23505' ? 'Bu slug zaten kullanılıyor.' : 'Yazı kaydedilemedi.')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'İşlem tamamlanamadı.'
    redirect(`${returnPath}?error=${safeMessage(message)}`)
  }
  revalidatePath('/')
  revalidatePath('/blog')
  redirect('/admin/blog?success=' + safeMessage(id ? 'Yazı güncellendi.' : 'Yazı oluşturuldu.'))
}

export async function deletePost(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  const { error } = await (await createClient()).from('blog_posts').delete().eq('id', id)
  if (error) redirect('/admin/blog?error=' + safeMessage('Yazı silinemedi.'))
  revalidatePath('/')
  revalidatePath('/blog')
  redirect('/admin/blog?success=' + safeMessage('Yazı silindi.'))
}
