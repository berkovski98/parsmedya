import { AdminBlogList } from '@/components/admin/blog-list'

export default function AdminEnglishBlogPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string; q?: string; category?: string; status?: string }> }) {
  return <AdminBlogList locale="en" searchParams={searchParams} />
}
