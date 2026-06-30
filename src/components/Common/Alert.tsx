import type { ReactNode } from 'react'

interface AlertProps {
  tone?: 'info' | 'warning' | 'error' | 'success'
  title?: string
  children: ReactNode
}

const toneMap = {
  info: 'border-blue-200 bg-blue-50 text-blue-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  error: 'border-red-200 bg-red-50 text-red-900',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
} as const

export function Alert({ tone = 'info', title, children }: AlertProps) {
  return (
    <div className={`rounded-xl border p-4 text-sm ${toneMap[tone]}`}>
      {title ? <div className="font-semibold">{title}</div> : null}
      <div className={title ? 'mt-1' : ''}>{children}</div>
    </div>
  )
}
