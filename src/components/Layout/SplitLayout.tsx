import type { ReactNode } from 'react'

interface SplitLayoutProps {
  left: ReactNode
  right: ReactNode
}

export function SplitLayout({ left, right }: SplitLayoutProps) {
  return (
    <div className="grid w-full gap-3 xl:grid-cols-[minmax(0,2.45fr)_minmax(360px,0.8fr)] 2xl:grid-cols-[minmax(0,2.7fr)_minmax(380px,0.75fr)]">
      <div className="min-w-0 space-y-3">{left}</div>
      <aside className="min-w-0 space-y-3 xl:sticky xl:top-[116px] xl:self-start">{right}</aside>
    </div>
  )
}
