import { formatArea, formatMass } from '../../utils/format'
import { useTranslation } from 'react-i18next'

interface CalculatorResultProps {
  area: number
  mass: number | null
  description: string
  status?: string
}

export function CalculatorResult({ area, mass, description, status }: CalculatorResultProps) {
  const { t } = useTranslation()

  return (
    <div className="brand-section overflow-hidden">
      <div className="brand-section-head px-4 py-3">
        <h4 className="text-base font-extrabold text-[#5b4e2a]">{t('calculator.resultTitle')}</h4>
      </div>
      <div className="grid gap-0 sm:grid-cols-2">
        <div className="border-b border-r-0 border-[#e7ddc2] bg-white p-4 sm:border-b-0 sm:border-r">
          <div className="text-sm font-bold text-[var(--brand-muted)]">{t('common.area')}</div>
          <div className="mt-1 text-2xl font-extrabold text-[var(--brand-ink)]">{formatArea(area, t('unit.m2'))}</div>
        </div>
        <div className="bg-white p-4">
          <div className="text-sm font-bold text-[var(--brand-muted)]">{t('common.mass')}</div>
          <div className="mt-1 text-2xl font-extrabold text-[var(--brand-ink)]">{formatMass(mass, t('unit.kg'))}</div>
        </div>
      </div>
      <div className="border-t border-[#e7ddc2] bg-[#f7f7f7] p-4 text-sm font-semibold leading-6 text-[#3f4652]">
        <div>{description}</div>
        {status ? <div className="calculator-auto-status mt-2">{status}</div> : null}
      </div>
    </div>
  )
}
