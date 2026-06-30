import { useProjectStore } from '../../store/projectStore'
import { formatArea, formatMass } from '../../utils/format'
import { useTranslation } from 'react-i18next'

export function SpecSummary() {
  const totals = useProjectStore((state) => state.project.metadata?.totals)
  const { t } = useTranslation()

  return (
    <div className="brand-section overflow-hidden">
      <div className="brand-section-head px-4 py-3"><h3 className="text-base font-extrabold text-[#5b4e2a]">{t('summary.title')}</h3></div>
      <div className="grid gap-0 sm:grid-cols-3">
        <div className="border-t border-[#e7ddc2] bg-white p-4 sm:border-l sm:border-t-0 first:sm:border-l-0">
          <div className="text-sm text-slate-500">{t('summary.items')}</div>
          <div className="mt-1 text-xl font-semibold text-slate-900">{totals?.itemCount ?? 0}</div>
        </div>
        <div className="border-t border-[#e7ddc2] bg-white p-4 sm:border-l sm:border-t-0 first:sm:border-l-0">
          <div className="text-sm text-slate-500">{t('summary.areaTotal')}</div>
          <div className="mt-1 text-xl font-semibold text-slate-900">{formatArea(totals?.areaTotal ?? 0, t('unit.m2'))}</div>
        </div>
        <div className="border-t border-[#e7ddc2] bg-white p-4 sm:border-l sm:border-t-0 first:sm:border-l-0">
          <div className="text-sm text-slate-500">{t('summary.massTotal')}</div>
          <div className="mt-1 text-xl font-semibold text-slate-900">{formatMass(totals?.massTotal ?? 0, t('unit.kg'))}</div>
        </div>
      </div>
    </div>
  )
}
