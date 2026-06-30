import { useMemo } from 'react'
import { useProjectStore } from '../../store/projectStore'
import { calculateMaterialSummary } from '../../domain/specification/materials'
import { formatArea, formatMass } from '../../utils/format'
import { useTranslation } from 'react-i18next'

export function MaterialSummary() {
  const items = useProjectStore((state) => state.project.items)
  const { t } = useTranslation()

  const summary = useMemo(() => calculateMaterialSummary(items), [items])

  return (
    <div className="brand-section overflow-hidden">
      <div className="bg-[#5d6673] px-4 py-3 text-white"><h3 className="text-base font-extrabold">{t('materials.title')}</h3></div>

      {summary.length === 0 ? (
        <p className="p-4 text-sm font-bold text-[var(--brand-muted)]">{t('materials.noData')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="brand-table min-w-[720px] w-full border-collapse text-sm">
            <thead className="text-left">
              <tr>
                <th className="px-3 py-2">{t('spec.material')}</th>
                <th className="px-3 py-2">{t('spec.thickness')}</th>
                <th className="px-3 py-2">{t('summary.items')}</th>
                <th className="px-3 py-2">{t('spec.area')}</th>
                <th className="px-3 py-2">{t('spec.mass')}</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((row) => (
                <tr key={`${row.material}-${row.thickness}`} >
                  <td className="px-3 py-2">{t(`material.${row.material}`)}</td>
                  <td className="px-3 py-2">{row.thickness}</td>
                  <td className="px-3 py-2">{row.itemCount}</td>
                  <td className="px-3 py-2">{formatArea(row.areaTotal, t('unit.m2'))}</td>
                  <td className="px-3 py-2">{formatMass(row.massTotal, t('unit.kg'))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
