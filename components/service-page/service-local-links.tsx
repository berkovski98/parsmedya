import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { getPublishedPosts } from '@/lib/blog'
import { turkishServiceSlug, type ServicePageModel } from '@/lib/service-page'
import { featuredCityLinks, relatedPostsForService } from '@/lib/service-links'
import type { Service } from '@/lib/services'
import type { EnglishService } from '@/lib/services-en'

const COPY = {
  tr: { cities: 'Öne çıkan şehirler', blog: 'İlgili blog yazıları', allAreas: 'Tüm hizmet bölgeleri', areasHref: '/hizmet-bolgeleri', blogBase: '/blog' },
  en: { cities: 'Featured cities', blog: 'Related articles', allAreas: 'All service areas', areasHref: '/en/service-areas', blogBase: '/en/blog' },
} as const

/** Links from a national service page to its indexed city pages and related blog posts (Ö14). */
export async function ServiceLocalLinks({ model, service }: { model: ServicePageModel; service: Service | EnglishService }) {
  const text = COPY[model.locale]
  const trSlug = turkishServiceSlug(service)
  const cities = featuredCityLinks(trSlug, model.locale)
  const posts = relatedPostsForService(trSlug, await getPublishedPosts(undefined, model.locale))
  if (!cities.length && !posts.length) return null
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2">
        {cities.length > 0 && (
          <nav aria-label={text.cities}>
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground">{text.cities}</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {cities.map((city) => (
                <li key={city.href}>
                  <Link href={city.href} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm transition-colors hover:border-accent/60">
                    <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                    {model.locale === 'en' ? `${model.title} in ${city.name}` : `${city.name} ${model.title}`}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href={text.areasHref} className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
              {text.allAreas}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </nav>
        )}
        {posts.length > 0 && (
          <nav aria-label={text.blog}>
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground">{text.blog}</h2>
            <ul className="mt-5 space-y-3">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link href={`${text.blogBase}/${post.slug}`} className="text-[0.9375rem] font-medium text-foreground underline-offset-4 hover:underline">
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </section>
  )
}
