import type { ReactNode } from 'react'

interface ParameterFieldProps {
  label: string
  children: ReactNode
}

export function ParameterField({ label, children }: ParameterFieldProps) {
  return (
    <label className="brand-input grid grid-cols-[minmax(120px,1fr)_minmax(120px,160px)] items-center gap-2 text-sm max-sm:grid-cols-1">
      <span className="font-semibold text-[#5b4e2a]">{label}</span>
      {children}
    </label>
  )
}