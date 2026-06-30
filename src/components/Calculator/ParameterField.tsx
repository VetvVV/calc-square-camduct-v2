import type { ReactNode } from 'react'

interface ParameterFieldProps {
  label: string
  children: ReactNode
}

export function ParameterField({ label, children }: ParameterFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  )
}
