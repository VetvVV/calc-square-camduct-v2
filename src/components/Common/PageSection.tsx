import type { ReactNode } from 'react'

interface PageSectionProps {
  title: string
  description?: string
  children: ReactNode
}

export function PageSection({ title, description, children }: PageSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
      </div>
      {children}
    </section>
  )
}
