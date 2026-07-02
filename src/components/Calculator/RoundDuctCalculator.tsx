import { type KeyboardEvent, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { calculateRoundDuct } from '../../domain/calculators'
import { buildDescription } from '../../domain/descriptions/descriptionBuilder'
import { filterMessagesByRole } from '../../domain/messages/messageFilter'
import { ParameterField } from './ParameterField'
import { CalculatorResult } from './CalculatorResult'
import { MessageList } from './MessageList'
import { AdminDebugPanel } from './AdminDebugPanel'
import { materialOptions } from '../../constants/materials'
import { useProjectStore } from '../../store/projectStore'
import { addItem, replaceItem } from '../../domain/specification/specificationManager'
import { createSpecificationItem } from '../../domain/specification/itemFactory'
import { useAppStore } from '../../store/appStore'
import { useTranslation } from 'react-i18next'
import { getGuestUsageLimitState } from '../../utils/guestUsage'
import { isGuestRole } from '../../constants/roles'
import { canAddSpecItem, canViewCamductMode, canViewDebugPanel, getCalculationLimit } from '../../roles/permissions'
import { AccessInvitationDialog } from '../Common/AccessInvitationDialog'

export function RoundDuctCalculator() {
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

  const [A, setA] = useState(250)
  const [B, setB] = useState(1000)
  const [quantity, setQuantity] = useState(1)
  const [material, setMaterial] = useState('galvanized')
  const [thickness, setThickness] = useState(0.5)
  const [C1, setC1] = useState<'none' | 'flange' | 'bandage'>('none')
  const [C2, setC2] = useState<'none' | 'flange' | 'bandage'>('none')
  const [internalJointType, setInternalJointType] = useState<'none' | 'nipple' | 'coupling' | 'overlap' | 'zig_tractor'>('none')
  const [comment, setComment] = useState('')
  const [guestUsageCount] = useState(() => getGuestUsageLimitState().count)
  const [invitationOpen, setInvitationOpen] = useState(false)

  useEffect(() => {
    if (!editingItemId || editingDraft?.moduleKey !== 'round-duct') return

    const parameters = (editingDraft.parameters ?? {}) as Record<string, unknown>
    const options = (editingDraft.options ?? {}) as Record<string, unknown>
    setA(Number(parameters.A ?? 250))
    setB(Number(parameters.B ?? 1000))
    setQuantity(Number((editingDraft.quantity as number | undefined) ?? 1))
    setMaterial(String(options.material ?? 'galvanized'))
    setThickness(Number(options.thickness ?? 0.5))
    setC1((parameters.C1 as 'none' | 'flange' | 'bandage' | undefined) ?? 'none')
    setC2((parameters.C2 as 'none' | 'flange' | 'bandage' | undefined) ?? 'none')
    setInternalJointType(
      (options.internalJointType as 'none' | 'nipple' | 'coupling' | 'overlap' | 'zig_tractor' | undefined) ?? 'none',
    )
    setComment(String(editingDraft.comment ?? ''))
  }, [editingDraft, editingItemId])

  const result = useMemo(
    () =>
      calculateRoundDuct({
        A,
        B,
        quantity,
        material,
        thickness,
        C1,
        C2,
        internalJointType,
      }),
    [A, B, quantity, material, thickness, C1, C2, internalJointType],
  )

  const description = useMemo(
    () =>
      buildDescription(i18n.t.bind(i18n), 'round-duct', {
        A,
        B,
        splitSummary: result.splitInfo?.summary,
        splitCount: result.splitInfo?.count,
      }),
    [A, B, i18n, result.splitInfo?.count, result.splitInfo?.summary],
  )

  const visibleMessages = filterMessagesByRole(result.messages, role)
  const roleLimit = getCalculationLimit(role)
  const roleUsageCount = isGuestRole(role) ? guestUsageCount : project.items.length
  const roleLimitReached = roleLimit !== null && roleUsageCount >= roleLimit
  const addAllowed = canAddSpecItem(role) && !roleLimitReached
  const showRoundSplitInfo = Boolean(result.splitInfo && (B > 2000 || (canViewDebugPanel(role) && camductMode)))

  const handleAdd = () => {
    if (!canAddSpecItem(role) || roleLimitReached) {
      setInvitationOpen(true)
      return
    }
    const item = createSpecificationItem('round-duct')
    item.quantity = quantity
    item.comment = comment
    item.parameters = { A, B, C1, C2 }
    item.options = { material, thickness, internalJointType }
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

    navigate('/split?module=round-duct')
  }

  const handleNumberKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    event.currentTarget.blur()
  }

  const materialConfig = materialOptions.find((option) => option.key === material) ?? materialOptions[0]

  return (
    <div className="space-y-6">
      <div className="brand-cream-panel">
        <div className="brand-section-head flex flex-col gap-3 px-4 py-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-[#5b4e2a]">R-001 / {t('product.roundDuctStraight')}</h3>
            <p className="mt-1 text-sm font-semibold leading-6 text-[#6d6247]">{t('product.roundDuctStraightDescription')}</p>
          </div>
          {showRoundSplitInfo && (
            <div className="rounded-lg border border-[#c9bea0] bg-white/70 px-3 py-2 text-sm font-semibold text-[#5b4e2a]">
              <div className="font-extrabold text-[#5b4e2a]">{t('split.roundStandard1250')}</div>
              <div className="mt-1">{result.splitInfo?.summary}</div>
            </div>
          )}
        </div>

        <div className="unit-label-v1 mx-4 mt-4">
          {t('unitSystem.title')}: {t('unit.mm')}
        </div>

        <div className="grid gap-2 p-4">
          <ParameterField label={camductMode && canViewCamductMode(role) ? `A / ${t('parameter.diameterLabel')}` : t('parameter.diameterLabel')}>
            <input type="number" placeholder={t('unit.mm')} value={A} onKeyDown={handleNumberKeyDown} onChange={(e) => setA(Number(e.target.value || 0))} className="w-full rounded-md border border-[#c9bea0] bg-white px-3 py-2" />
          </ParameterField>
          <ParameterField label={camductMode && canViewCamductMode(role) ? `B / ${t('parameter.lengthLabel')}` : t('parameter.lengthLabel')}>
            <input type="number" placeholder={t('unit.mm')} value={B} onKeyDown={handleNumberKeyDown} onChange={(e) => setB(Number(e.target.value || 0))} className="w-full rounded-md border border-[#c9bea0] bg-white px-3 py-2" />
          </ParameterField>
          <ParameterField label={t('common.quantity')}>
            <input type="number" value={quantity} onKeyDown={handleNumberKeyDown} onChange={(e) => setQuantity(Number(e.target.value || 1))} className="w-full rounded-md border border-[#c9bea0] bg-white px-3 py-2" />
          </ParameterField>
          <ParameterField label={t('common.material')}>
            <select value={material} onChange={(e) => setMaterial(e.target.value)} className="w-full rounded-md border border-[#c9bea0] bg-white px-3 py-2">
              {materialOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {t(`material.${option.key}`)}
                </option>
              ))}
            </select>
          </ParameterField>
          <ParameterField label={t('common.thickness')}>
            <select value={thickness} onChange={(e) => setThickness(Number(e.target.value))} className="w-full rounded-md border border-[#c9bea0] bg-white px-3 py-2">
              {materialConfig.thicknesses.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </ParameterField>
          <ParameterField label={t('connector.c1')}>
            <select value={C1} onChange={(e) => setC1(e.target.value as 'none' | 'flange' | 'bandage')} className="w-full rounded-md border border-[#c9bea0] bg-white px-3 py-2">
              <option value="none">{t('connector.none')}</option>
              <option value="flange">{t('connector.flange')}</option>
              <option value="bandage">{t('connector.bandage')}</option>
            </select>
          </ParameterField>
          <ParameterField label={t('connector.c2')}>
            <select value={C2} onChange={(e) => setC2(e.target.value as 'none' | 'flange' | 'bandage')} className="w-full rounded-md border border-[#c9bea0] bg-white px-3 py-2">
              <option value="none">{t('connector.none')}</option>
              <option value="flange">{t('connector.flange')}</option>
              <option value="bandage">{t('connector.bandage')}</option>
            </select>
          </ParameterField>
          <ParameterField label={t('common.internalJointType')}>
            <select value={internalJointType} onChange={(e) => setInternalJointType(e.target.value as 'none' | 'nipple' | 'coupling' | 'overlap' | 'zig_tractor')} className="w-full rounded-md border border-[#c9bea0] bg-white px-3 py-2">
              <option value="none">{t('common.none')}</option>
              <option value="nipple">{t('jointType.nipple')}</option>
              <option value="coupling">{t('jointType.coupling')}</option>
              <option value="overlap">{t('jointType.overlap')}</option>
              <option value="zig_tractor">{t('jointType.zigTractor')}</option>
            </select>
          </ParameterField>
        </div>

        <div className="px-4 pb-1">
          <ParameterField label={t('common.comment')}>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="min-h-20 w-full rounded-md border border-[#c9bea0] bg-white px-3 py-2" />
          </ParameterField>
        </div>

      </div>

      <CalculatorResult
        area={result.calculated.areaDisplay}
        mass={result.calculated.massDisplay}
        description={description}
        status={t('calculator.autoCalculation')}
      />

      <div className="calculator-action-row">
        <button type="button" aria-disabled={!addAllowed} onClick={handleAdd} className={addAllowed ? 'brand-action-button px-5 py-3 text-sm' : 'calculator-add-button px-5 py-3 text-sm'}>
          {editingItemId ? t('action.updateItem') : t('action.addToProject')}
        </button>
      </div>

      <MessageList messages={visibleMessages} />

      {canViewDebugPanel(role) && camductMode && <AdminDebugPanel data={{ camductMode, result }} />}

      <AccessInvitationDialog open={invitationOpen} onClose={() => setInvitationOpen(false)} />
    </div>
  )
}








