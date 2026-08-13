export type BlogStatus = 'draft' | 'published'

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image_url: string
  category: string
  author: string
  seo_title: string | null
  seo_description: string | null
  status: BlogStatus
  published_at: string | null
  created_at: string
  updated_at: string
  locale: 'tr' | 'en'
  translation_group_id: string | null
}

export type BlogPostInput = Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>
