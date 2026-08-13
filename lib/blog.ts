import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { hasSupabaseConfig } from '@/lib/supabase/config'
import type { BlogPost } from '@/lib/supabase/types'

export async function getPublishedPosts(limit?: number): Promise<BlogPost[]> {
  if (!hasSupabaseConfig()) return []
  const supabase = await createClient()
  let query = supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  if (limit) query = query.limit(limit)
  const { data, error } = await query
  if (error) return []
  return data as BlogPost[]
}

export async function getPublishedPost(slug: string): Promise<BlogPost | null> {
  if (!hasSupabaseConfig()) return null
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()
  if (error || !data) return null
  return data as BlogPost
}

export function formatBlogDate(date: string | null): string {
  if (!date) return 'Henüz yayınlanmadı'
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(date))
}

export function parseContent(content: string) {
  return content.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean).map((block) => {
    const heading = block.match(/^##\s+(.+)$/)
    return heading ? { type: 'heading' as const, text: heading[1] } : { type: 'paragraph' as const, text: block.replace(/^#\s+/, '') }
  })
}
