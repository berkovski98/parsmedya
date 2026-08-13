import { BlogForm } from '@/components/admin/blog-form'

export default async function NewBlogPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams
  return <div className="mx-auto max-w-5xl"><h1 className="font-display text-3xl font-bold">Yeni Blog Yazısı</h1><p className="mt-2 text-muted-foreground">Yeni içeriğinizi hazırlayın ve yayın durumunu belirleyin.</p><div className="mt-8 rounded-xl border border-border bg-card p-5 sm:p-7"><BlogForm error={error} /></div></div>
}
