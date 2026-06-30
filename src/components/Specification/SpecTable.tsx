import { useNavigate } from 'react-router-dom'
import { useProjectStore } from '../../store/projectStore'
import { removeItem } from '../../domain/specification/specificationManager'
import { SpecRow } from './SpecRow'
import type { SpecificationItem } from '../../types'
import { useAppStore } from '../../store/appStore'
import { useTranslation } from 'react-i18next'

export function SpecTable() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setActiveModule = useAppStore((state) => state.setActiveModule)
  const project = useProjectStore((state) => state.project)
  const setProject = useProjectStore((state) => state.setProject)
  const setEditingItemId = useProjectStore((state) => state.setEditingItemId)
  const setEditingDraft = useProjectStore((state) => state.setEditingDraft)

  const handleRemove = (itemId: string) => {
    setProject(removeItem(project, itemId))
  }

  const handleEdit = (item: SpecificationItem) => {
    setActiveModule(item.moduleKey)
    setEditingItemId(item.id)
    setEditingDraft({
      moduleKey: item.moduleKey,
      parameters: item.parameters,
      options: item.options,
      comment: item.comment,
      quantity: item.quantity,
      moduleMetadata: item.moduleMetadata,
    })
    navigate(`/split?module=${item.moduleKey}`)
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
        <h3 className="text-lg font-semibold text-slate-900">{t('project.specificationTitle')}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">№</th>
              <th className="px-4 py-3">{t('spec.item')}</th>
              <th className="px-4 py-3">{t('spec.sizes')}</th>
              <th className="px-4 py-3">{t('spec.description')}</th>
              <th className="px-4 py-3">{t('spec.qty')}</th>
              <th className="px-4 py-3">{t('spec.material')}</th>
              <th className="px-4 py-3">{t('spec.thickness')}</th>
              <th className="px-4 py-3">{t('spec.area')}</th>
              <th className="px-4 py-3">{t('spec.mass')}</th>
              <th className="px-4 py-3">{t('spec.comment')}</th>
              <th className="px-4 py-3">{t('spec.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {project.items.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-4 py-8 text-center text-slate-500">
                  {t('project.noItems')}
                </td>
              </tr>
            ) : (
              project.items.map((item, index) => (
                <SpecRow key={item.id} index={index} item={item} onRemove={handleRemove} onEdit={handleEdit} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
