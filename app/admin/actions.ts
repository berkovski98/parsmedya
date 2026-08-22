'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { revalidateBlogContent } from '@/lib/blog-cache'
import { requireAdmin } from '@/lib/supabase/auth'
import { hasSupabaseConfig } from '@/lib/supabase/config'
import type { BlogPostInput, BlogStatus } from '@/lib/supabase/types'
import { isPersistentPublicImageUrl, validateBlogImage } from '@/lib/blog-image'
import { contactStatuses, type ContactStatus } from '@/lib/contact'

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
    locale: String(formData.get('locale')) === 'en' ? 'en' : 'tr',
    translation_group_id: String(formData.get('translation_group_id') || '').trim() || null,
  }
}

async function uploadImage(file: File, currentUrl: string) {
  const existingUrl = isPersistentPublicImageUrl(currentUrl) ? currentUrl : ''
  if (!file.size) return existingUrl
  validateBlogImage(file)
  const supabase = await createClient()
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${crypto.randomUUID()}.${extension}`
  const { error } = await supabase.storage.from('blog-images').upload(path, file, { contentType: file.type, upsert: false })
  if (error) throw new Error('Görsel yüklenemedi. Lütfen tekrar deneyin.')
  const publicUrl = supabase.storage.from('blog-images').getPublicUrl(path).data.publicUrl
  if (!isPersistentPublicImageUrl(publicUrl)) throw new Error('Görsel adresi kaydedilemedi. Lütfen tekrar deneyin.')
  return publicUrl
}

export async function savePost(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  const translationSourceId = String(formData.get('translation_source_id') || '')
  const newQuery = translationSourceId ? `?translateFrom=${encodeURIComponent(translationSourceId)}` : ''
  const returnPath = id ? `/admin/blog/${id}/edit` : `/admin/blog/new${newQuery}`
  let savedLocale: 'tr' | 'en' = 'tr'
  let savedSlug = ''
  try {
    const imageUrl = await uploadImage(formData.get('image') as File, String(formData.get('current_image_url') || ''))
    const post = toPostInput(formData, imageUrl)
    savedLocale = post.locale
    savedSlug = post.slug
    if (!post.title || !post.slug || !post.excerpt || !post.content || !post.category || !post.author) throw new Error('Zorunlu alanları doldurun.')
    const supabase = await createClient()
    if (translationSourceId && !id) {
      const { data: source, error: sourceError } = await supabase.from('blog_posts').select('id,locale,translation_group_id').eq('id', translationSourceId).maybeSingle()
      if (sourceError || !source) throw new Error('Çeviri kaynağı bulunamadı.')
      post.locale = source.locale === 'tr' ? 'en' : 'tr'
      savedLocale = post.locale
      post.translation_group_id = source.translation_group_id || crypto.randomUUID()
      if (!source.translation_group_id) {
        const { error: groupError } = await supabase.from('blog_posts').update({ translation_group_id: post.translation_group_id }).eq('id', source.id)
        if (groupError) throw new Error('Çeviri bağlantısı oluşturulamadı.')
      }
      const { data: existingTranslation } = await supabase.from('blog_posts').select('id').eq('translation_group_id', post.translation_group_id).eq('locale', post.locale).maybeSingle()
      if (existingTranslation) throw new Error('Bu yazının ilgili dilde bir çevirisi zaten var.')
    }
    let duplicateQuery = supabase.from('blog_posts').select('id').eq('slug', post.slug).limit(1)
    if (id) duplicateQuery = duplicateQuery.neq('id', id)
    const { data: duplicates, error: duplicateError } = await duplicateQuery
    if (duplicateError) throw new Error('Slug benzersizliği doğrulanamadı.')
    if (duplicates?.length) throw new Error('Bu slug başka bir yazıda kullanılıyor.')
    const result = id ? await supabase.from('blog_posts').update(post).eq('id', id) : await supabase.from('blog_posts').insert(post)
    if (result.error) throw new Error(result.error.code === '23505' ? 'Bu slug zaten kullanılıyor.' : 'Yazı kaydedilemedi.')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'İşlem tamamlanamadı.'
    redirect(`${returnPath}?error=${safeMessage(message)}`)
  }
  revalidateBlogContent({ locale: savedLocale, slug: savedSlug })
  const listPath = savedLocale === 'en' ? '/admin/blog/en' : '/admin/blog'
  redirect(`${listPath}?success=${safeMessage(id ? 'Yazı güncellendi.' : 'Yazı oluşturuldu.')}`)
}

export async function deletePost(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  const locale = String(formData.get('locale')) === 'en' ? 'en' : 'tr'
  const slug = String(formData.get('slug') || '').trim()
  const { error } = await (await createClient()).from('blog_posts').delete().eq('id', id)
  if (error) redirect(`${locale === 'en' ? '/admin/blog/en' : '/admin/blog'}?error=${safeMessage('Yazı silinemedi.')}`)
  revalidateBlogContent({ locale, slug: slug || undefined })
  redirect(`${locale === 'en' ? '/admin/blog/en' : '/admin/blog'}?success=${safeMessage('Yazı silindi.')}`)
}

export async function updateContact(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  const status = String(formData.get('status') || '') as ContactStatus
  const adminNote = String(formData.get('admin_note') || '').trim()
  if (!id || !contactStatuses.includes(status) || adminNote.length > 2000) {
    redirect(`/admin/contact/${id}?error=${safeMessage('Geçersiz talep bilgisi.')}`)
  }
  const { error } = await (await createClient())
    .from('contact_messages')
    .update({ status, admin_note: adminNote || null })
    .eq('id', id)
  if (error) redirect(`/admin/contact/${id}?error=${safeMessage('Talep güncellenemedi.')}`)
  revalidatePath('/admin')
  revalidatePath('/admin/contact')
  redirect(`/admin/contact/${id}?success=${safeMessage('Talep güncellendi.')}`)
}

export async function deleteContact(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  if (!id) redirect('/admin/contact?error=' + safeMessage('Geçersiz talep.'))
  const { error } = await (await createClient()).from('contact_messages').delete().eq('id', id)
  if (error) redirect(`/admin/contact/${id}?error=${safeMessage('Talep silinemedi.')}`)
  revalidatePath('/admin')
  revalidatePath('/admin/contact')
  redirect('/admin/contact?success=' + safeMessage('Talep kalıcı olarak silindi.'))
}

function parseFaqJson(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return null
  const parsed = JSON.parse(trimmed) as unknown
  if (!Array.isArray(parsed)) throw new Error('SSS JSON bir dizi olmalıdır.')
  return parsed.map((item) => {
    if (!item || typeof item !== 'object') throw new Error('Geçersiz SSS kaydı.')
    const question = String((item as { question?: string }).question || '').trim()
    const answer = String((item as { answer?: string }).answer || '').trim()
    if (!question || !answer) throw new Error('Her SSS maddesinde question ve answer olmalıdır.')
    return { question, answer }
  })
}

export async function saveLocalSeoOverride(formData: FormData) {
  await requireAdmin()
  const city = String(formData.get('city_slug') || '').trim()
  const districtRaw = String(formData.get('district_slug') || '').trim()
  const service = String(formData.get('service_slug') || '').trim()
  const district = districtRaw || null
  if (!city || !service) {
    redirect('/admin/local-seo?error=' + safeMessage('Şehir ve hizmet seçilmelidir.'))
  }
  let faqJson = null
  try {
    faqJson = parseFaqJson(String(formData.get('faq_json') || ''))
  } catch (error) {
    redirect(`/admin/local-seo?error=${safeMessage(error instanceof Error ? error.message : 'SSS JSON geçersiz.')}`)
  }
  const payload = {
    locale: 'tr',
    city_slug: city,
    district_slug: district || '',
    service_slug: service,
    seo_title: String(formData.get('seo_title') || '').trim() || null,
    meta_description: String(formData.get('meta_description') || '').trim() || null,
    hero_title: String(formData.get('hero_title') || '').trim() || null,
    hero_description: String(formData.get('hero_description') || '').trim() || null,
    content_json: {
      intro: String(formData.get('intro') || '').trim() || undefined,
      locationIntro: String(formData.get('location_intro') || '').trim() || undefined,
    },
    faq_json: faqJson,
    is_indexable: !formData.get('noindex'),
  }
  const supabase = await createClient()
  const { error } = await supabase.from('local_seo_overrides').upsert(payload, {
    onConflict: 'locale,city_slug,district_slug,service_slug',
  })
  if (error) redirect(`/admin/local-seo?error=${safeMessage('Override kaydedilemedi.')}`)
  revalidatePath('/')
  revalidatePath('/sitemap.xml')
  revalidatePath('/sitemaps/local-cities.xml')
  revalidatePath('/sitemaps/local-services-1.xml')
  revalidatePath('/admin/local-seo')
  redirect('/admin/local-seo?success=' + safeMessage('Local SEO içeriği kaydedildi.'))
}
