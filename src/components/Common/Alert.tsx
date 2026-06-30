import type { ReactNode } from 'react'

interface AlertProps {
  tone?: 'info' | 'warning' | 'error' | 'success'
  title?: string
  children: ReactNode
}

const toneMap = {
  info: 'border-[#ead4b5] bg-[#fff8ec] text-[#5b4e2a]',
  warning: 'border-[#ead4b5] bg-[#fff7ed] text-[#8a5a10]',
  error: 'border-red-200 bg-red-50 text-red-900',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
} as const

export function Alert({ tone = 'info', title, children }: AlertProps) {
  return (
    <div className={`rounded-lg border px-3 py-2 text-sm font-bold leading-6 ${toneMap[tone]}`}>
      {title ? <div className="font-extrabold">{title}</div> : null}
      <div className={title ? 'mt-1' : ''}>{children}</div>
    </div>
  )
}