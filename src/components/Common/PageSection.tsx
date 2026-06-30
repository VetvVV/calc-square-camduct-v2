import type { ReactNode } from 'react'

interface PageSectionProps {
  title: string
  description?: string
  children: ReactNode
}

export function PageSection({ title, description, children }: PageSectionProps) {
  return (
    <section className="brand-section overflow-hidden">
      <div className="brand-section-head px-5 py-4 text-center">
        <h2 className="text-2xl font-extrabold uppercase tracking-[0.03em] text-[#5b6573]">{title}</h2>
        {description ? <p className="mx-auto mt-3 max-w-3xl text-sm font-bold leading-6 text-[var(--brand-muted)]">{description}</p> : null}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  )
}