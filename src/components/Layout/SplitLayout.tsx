import type { ReactNode } from 'react'

interface SplitLayoutProps {
  left: ReactNode
  right: ReactNode
}

export function SplitLayout({ left, right }: SplitLayoutProps) {
  return (
    <div className="grid w-full gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(400px,0.95fr)] 2xl:grid-cols-[minmax(0,2.1fr)_minmax(430px,0.9fr)]">
      <div className="min-w-0 space-y-3">{left}</div>
      <aside className="min-w-0 space-y-3 xl:sticky xl:top-[116px] xl:self-start">{right}</aside>
    </div>
  )
}