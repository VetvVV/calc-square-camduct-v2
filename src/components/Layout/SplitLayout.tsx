import type { ReactNode } from 'react'

interface SplitLayoutProps {
  left: ReactNode
  right: ReactNode
}

export function SplitLayout({ left, right }: SplitLayoutProps) {
  return (
    <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.18fr)_minmax(360px,0.82fr)]">
      <div className="min-w-0 space-y-6">{left}</div>
      <div className="min-w-0 space-y-6 2xl:sticky 2xl:top-6 2xl:self-start">{right}</div>
    </div>
  )
}
