import { type KeyboardEvent, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { calculateRectDuct } from '../../domain/calculators'
import { buildDescription } from '../../domain/descriptions/descriptionBuilder'
import { addItem, replaceItem } from '../../domain/specification/specificationManager'
import { createSpecificationItem } from '../../domain/specification/itemFactory'
import { useAppStore } from '../../store/appStore'
import { useProjectStore } from '../../store/projectStore'
import { isGuestRole } from '../../constants/roles'
import { canAddSpecItem, canViewCamductMode, canViewDebugPanel, getCalculationLimit } from '../../roles/permissions'
import { getGuestUsageLimitState } from '../../utils/guestUsage'
import { AccessInvitationDialog } from '../Common/AccessInvitationDialog'
import { AdminDebugPanel } from './AdminDebugPanel'
import { CalculatorResult } from './CalculatorResult'
import { MessageList } from './MessageList'
import { ParameterField } from './ParameterField'

export function RectDuctCalculator() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const role = useAppStore((state) => state.role)
  const camductMode = useAppStore((state) => state.camductMode)
  const project = useProjectStore((state) => state.project)
  const setProject = useProjectStore((state) => state.setProject)
  const editingItemId = useProjectStore((state) => state.editingItemId)
  const editingDraft = useProjectStore((state) => state.editingDraft)
  const setEditingItemId = useProjectStore((state) => state.setEditingItemId)
  const setEditingDraft = useProjectStore((state) => state.setEditingDraft)

  const [A, setA] = useState(400)
  const [B, setB] = useState(300)
  const [L, setL] = useState(1000)
  const [T, setT] = useState(0.5)
  const [Q, setQ] = useState(1)
  const [comment, setComment] = useState('')
  const [guestUsageCount] = useState(() => getGuestUsageLimitState().count)
  const [invitationOpen, setInvitationOpen] = useState(false)

  useEffect(() => {
    if (!editingItemId || editingDraft?.moduleKey !== 'rect-duct') return

    const parameters = (editingDraft.parameters ?? {}) as Record<string, unknown>
    const options = (editingDraft.options ?? {}) as Record<string, unknown>
    setA(Number(parameters.A ?? 400))
    setB(Number(parameters.B ?? 300))
    setL(Number(parameters.L ?? 1000))
    setT(Number(options.thickness ?? 0.5))
    setQ(Number((parameters.Q as number | undefined) ?? 1))
    setComment(String(editingDraft.comment ?? ''))
  }, [editingDraft, editingItemId])

  const result = useMemo(() => calculateRectDuct({ A, B, L, T, Q }), [A, B, L, T, Q])
  const rectMeta = result.moduleMetadata.rectangularDuct as {
    lockLabelKey?: string
    lockSize?: string
    layout?: string
    russianLocks?: number
  } | undefined

  const description = useMemo(
    () =>
      buildDescription(i18n.t.bind(i18n), 'rect-duct', {
        A,
        B,
        L,
        thickness: T,
        lockLabelKey: rectMeta?.lockLabelKey,
        lockSize: rectMeta?.lockSize,
        layout: rectMeta?.layout,
        russianLocks: rectMeta?.russianLocks,
      }),
    [A, B, L, T, i18n, rectMeta?.layout, rectMeta?.lockLabelKey, rectMeta?.lockSize, rectMeta?.russianLocks],
  )

  const roleLimit = getCalculationLimit(role)
  const roleUsageCount = isGuestRole(role) ? guestUsageCount : project.items.length
  const roleLimitReached = roleLimit !== null && roleUsageCount >= roleLimit
  const addAllowed = canAddSpecItem(role) && !roleLimitReached
  const serviceLabels = camductMode && canViewCamductMode(role)

  const handleAdd = () => {
    if (!canAddSpecItem(role) || roleLimitReached) {
      setInvitationOpen(true)
      return
    }

    const item = createSpecificationItem('rect-duct')
    item.quantity = Q
    item.comment = comment
    item.parameters = { A, B, L, Q }
    item.options = { material: 'galvanized', thickness: T }
    item.calculated = {
      areaRaw: result.calculated.areaRaw,
      areaDisplay: result.calculated.areaDisplay,
      massRaw: result.calculated.massRaw,
      massDisplay: result.calculated.massDisplay,
    }
    item.moduleMetadata = result.moduleMetadata
    item.messages = result.messages

    if (editingItemId) {
      item.id = editingItemId
      setProject(replaceItem(project, editingItemId, item))
      setEditingItemId(null)
      setEditingDraft(null)
    } else {
      setProject(addItem(project, item))
    }

    navigate('/split?module=rect-duct')
  }

  const handleNumberKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    event.currentTarget.blur()
  }

  return (
    <div className="space-y-6">
      <div className="brand-cream-panel">
        <div className="brand-section-head flex flex-col gap-3 px-4 py-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-[#5b4e2a]">PRM-001 / {t('product.rectDuct')}</h3>
            <p className="mt-1 text-sm font-semibold leading-6 text-[#6d6247]">{t('product.rectDuctDescription')}</p>
          </div>
        </div>

        <div className="unit-label-v1 mx-4 mt-4">
          {t('unitSystem.title')}: {t('unit.mm')}
        </div>

        <div className="grid gap-2 p-4">
          <ParameterField label={serviceLabels ? t('parameter.rectWidthService') : t('parameter.widthLabel')}>
            <input type="number" placeholder={t('unit.mm')} value={A} onKeyDown={handleNumberKeyDown} onChange={(e) => setA(Number(e.target.value || 0))} className="w-full rounded-md border border-[#c9bea0] bg-white px-3 py-2" />
          </ParameterField>
          <ParameterField label={serviceLabels ? t('parameter.rectHeightService') : t('parameter.heightLabel')}>
            <input type="number" placeholder={t('unit.mm')} value={B} onKeyDown={handleNumberKeyDown} onChange={(e) => setB(Number(e.target.value || 0))} className="w-full rounded-md border border-[#c9bea0] bg-white px-3 py-2" />
          </ParameterField>
          <ParameterField label={serviceLabels ? t('parameter.rectLengthService') : t('parameter.rectLengthLabel')}>
            <input type="number" placeholder={t('unit.mm')} value={L} onKeyDown={handleNumberKeyDown} onChange={(e) => setL(Number(e.target.value || 0))} className="w-full rounded-md border border-[#c9bea0] bg-white px-3 py-2" />
          </ParameterField>
          <ParameterField label={`${t('common.thickness')}, ${t('unit.mm')}`}>
            <input type="number" step="0.1" placeholder={t('unit.mm')} value={T} onKeyDown={handleNumberKeyDown} onChange={(e) => setT(Number(e.target.value || 0))} className="w-full rounded-md border border-[#c9bea0] bg-white px-3 py-2" />
          </ParameterField>
          <ParameterField label={t('common.quantity')}>
            <input type="number" value={Q} onKeyDown={handleNumberKeyDown} onChange={(e) => setQ(Number(e.target.value || 1))} className="w-full rounded-md border border-[#c9bea0] bg-white px-3 py-2" />
          </ParameterField>
        </div>

        <div className="px-4 pb-1">
          <ParameterField label={t('common.comment')}>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="min-h-20 w-full rounded-md border border-[#c9bea0] bg-white px-3 py-2" />
          </ParameterField>
        </div>
      </div>

      <CalculatorResult area={result.calculated.areaDisplay} mass={result.calculated.massDisplay} description={description} status={t('calculator.autoCalculation')} />

      <div className="calculator-action-row">
        <button type="button" onClick={handleAdd} className={addAllowed ? 'brand-action-button px-5 py-3 text-sm' : 'calculator-add-button px-5 py-3 text-sm'}>
          {editingItemId ? t('action.updateItem') : t('action.addToProject')}
        </button>
      </div>

      <MessageList messages={result.messages} />

      {canViewDebugPanel(role) && camductMode && <AdminDebugPanel data={{ camductMode, result }} />}

      <AccessInvitationDialog open={invitationOpen} onClose={() => setInvitationOpen(false)} />
    </div>
  )
}


