import type { ReactNode } from 'react'

interface SplitLayoutProps {
  left: ReactNode
  right: ReactNode
}

export function SplitLayout({ left, right }: SplitLayoutProps) {
  return (
    <div className="workspace-split-v1">
      <section className="workspace-split-panel-v1 workspace-split-panel-v1--specification" aria-label="Specification workspace panel">
        <div className="workspace-split-panel-inner-v1">{left}</div>
      </section>
      <aside className="workspace-split-panel-v1 workspace-split-panel-v1--calculator" aria-label="Calculator workspace panel">
        <div className="workspace-split-panel-inner-v1">{right}</div>
      </aside>
    </div>
  )
}
