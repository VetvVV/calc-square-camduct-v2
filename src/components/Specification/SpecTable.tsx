import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjectStore } from '../../store/projectStore'
import { removeItem } from '../../domain/specification/specificationManager'
import { SpecRow } from './SpecRow'
import type { SpecificationItem } from '../../types'
import { useAppStore } from '../../store/appStore'
import { canEditSpecItem, canRemoveSpecItem } from '../../roles/permissions'
import { StatusBanner } from '../Common/StatusBanner'
import { useTranslation } from 'react-i18next'

export function SpecTable() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const role = useAppStore((state) => state.role)
  const setActiveModule = useAppStore((state) => state.setActiveModule)
  const project = useProjectStore((state) => state.project)
  const setProject = useProjectStore((state) => state.setProject)
  const setEditingItemId = useProjectStore((state) => state.setEditingItemId)
  const setEditingDraft = useProjectStore((state) => state.setEditingDraft)
  const [lockedMessage, setLockedMessage] = useState(false)
  const editAllowed = canEditSpecItem(role)
  const removeAllowed = canRemoveSpecItem(role)

  const handleLockedAction = () => {
    setLockedMessage(true)
  }

  const handleRemove = (itemId: string) => {
    if (!removeAllowed) return handleLockedAction()
    setProject(removeItem(project, itemId))
  }

  const handleEdit = (item: SpecificationItem) => {
    if (!editAllowed) return handleLockedAction()
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
    <div className="brand-section overflow-hidden">
      <div className="brand-section-head px-4 py-3">
        <h3 className="text-lg font-extrabold uppercase tracking-[0.03em] text-[#5b4e2a]">{t('project.specificationTitle')}</h3>
      </div>

      {lockedMessage ? (
        <div className="p-4 pb-0">
          <StatusBanner tone="warning" title={t('access.lockedTitle')} description={t('access.clientOnlyFeature')} />
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="brand-table min-w-[1180px] w-full border-collapse text-sm">
          <thead className="text-left">
            <tr>
              <th className="w-14 px-4 py-3">№</th>
              <th className="min-w-44 px-4 py-3">{t('spec.item')}</th>
              <th className="min-w-48 px-4 py-3">{t('spec.sizes')}</th>
              <th className="min-w-[320px] px-4 py-3">{t('spec.description')}</th>
              <th className="px-4 py-3">{t('spec.qty')}</th>
              <th className="px-4 py-3">{t('spec.material')}</th>
              <th className="px-4 py-3">{t('spec.thickness')}</th>
              <th className="px-4 py-3">{t('spec.area')}</th>
              <th className="px-4 py-3">{t('spec.mass')}</th>
              <th className="px-4 py-3">{t('spec.comment')}</th>
              <th className="min-w-36 px-4 py-3">{t('spec.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {project.items.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-4 py-8 text-center text-slate-500">
                  {t('project.noItems')}
                </td>
              </tr>
            ) : (
              project.items.map((item, index) => (
                <SpecRow
                  key={item.id}
                  index={index}
                  item={item}
                  onRemove={handleRemove}
                  onEdit={handleEdit}
                  canEdit={editAllowed}
                  canRemove={removeAllowed}
                  onLockedAction={handleLockedAction}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
