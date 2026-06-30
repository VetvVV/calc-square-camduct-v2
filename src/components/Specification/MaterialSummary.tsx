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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Material summary</h3>

      {summary.length === 0 ? (
        <p className="mt-2 text-sm text-slate-600">No material data yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="px-3 py-2">Material</th>
                <th className="px-3 py-2">Thickness</th>
                <th className="px-3 py-2">Items</th>
                <th className="px-3 py-2">Area</th>
                <th className="px-3 py-2">Mass</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((row) => (
                <tr key={`${row.material}-${row.thickness}`} className="border-t border-slate-100">
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
