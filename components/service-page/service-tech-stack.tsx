import { SERVICE_UI, type ServicePageModel } from '@/lib/service-page'

export function ServiceTechStack({
  model,
  technologies,
}: {
  model: ServicePageModel
  technologies: string[]
}) {
  const ui = SERVICE_UI[model.locale]

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">{ui.techLabel}</p>
        <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {ui.techTitle}
        </h2>
        <ul className="mt-8 flex flex-wrap gap-2.5">
          {technologies.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
