import { formatArea, formatMass } from '../../utils/format'
import { useTranslation } from 'react-i18next'

interface CalculatorResultProps {
  area: number
  mass: number | null
  description: string
}

export function CalculatorResult({ area, mass, description }: CalculatorResultProps) {
  const { t } = useTranslation()

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h4 className="text-lg font-semibold text-slate-900">Calculation result</h4>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">{t('common.area')}</div>
          <div className="mt-1 text-xl font-semibold text-slate-900">{formatArea(area, t('unit.m2'))}</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">{t('common.mass')}</div>
          <div className="mt-1 text-xl font-semibold text-slate-900">{formatMass(mass, t('unit.kg'))}</div>
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">{description}</div>
    </div>
  )
}
