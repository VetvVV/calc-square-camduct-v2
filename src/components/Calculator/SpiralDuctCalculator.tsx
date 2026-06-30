import { useEffect, useMemo, useState } from 'react'
import { calculateSpiralDuct } from '../../domain/calculators'
import { buildDescription } from '../../domain/descriptions/descriptionBuilder'
import { filterMessagesByRole } from '../../domain/messages/messageFilter'
import { ParameterField } from './ParameterField'
import { CalculatorResult } from './CalculatorResult'
import { MessageList } from './MessageList'
import { AdminDebugPanel } from './AdminDebugPanel'
import { SectionLengthSelector } from './SectionLengthSelector'
import { materialOptions } from '../../constants/materials'
import { useProjectStore } from '../../store/projectStore'
import { addItem, replaceItem } from '../../domain/specification/specificationManager'
import { createSpecificationItem } from '../../domain/specification/itemFactory'
import { useAppStore } from '../../store/appStore'
import { useTranslation } from 'react-i18next'
import { getGuestUsageLimitState, incrementGuestUsage } from '../../utils/guestUsage'
import { guestCalculationLimitPerDay, isGuestRole } from '../../constants/roles'
import { Alert } from '../Common/Alert'

export function SpiralDuctCalculator() {
  const { t, i18n } = useTranslation()
  const role = useAppStore((state) => state.role)
  const camductMode = useAppStore((state) => state.camductMode)
  const project = useProjectStore((state) => state.project)
  const setProject = useProjectStore((state) => state.setProject)
  const editingItemId = useProjectStore((state) => state.editingItemId)
  const editingDraft = useProjectStore((state) => state.editingDraft)
  const setEditingItemId = useProjectStore((state) => state.setEditingItemId)
  const setEditingDraft = useProjectStore((state) => state.setEditingDraft)

  const [A, setA] = useState(250)
  const [B, setB] = useState(6000)
  const [Q, setQ] = useState(1)
  const [material, setMaterial] = useState('galvanized')
  const [thickness, setThickness] = useState(0.5)
  const [spiralSectionLength, setSpiralSectionLength] = useState<6000 | 5000 | 4000 | 3000 | 2000>(6000)
  const [comment, setComment] = useState('')
  const [guestUsageCount, setGuestUsageCount] = useState(() => getGuestUsageLimitState().count)

  useEffect(() => {
    if (!editingItemId || editingDraft?.moduleKey !== 'spiral-duct') return

    const parameters = (editingDraft.parameters ?? {}) as Record<string, unknown>
    const options = (editingDraft.options ?? {}) as Record<string, unknown>
    setA(Number(parameters.A ?? 250))
    setB(Number(parameters.B ?? 6000))
    setQ(Number((parameters.Q as number | undefined) ?? 1))
    setMaterial(String(options.material ?? 'galvanized'))
    setThickness(Number(options.thickness ?? 0.5))
    setSpiralSectionLength(Number(options.spiralSectionLength ?? 6000) as 6000 | 5000 | 4000 | 3000 | 2000)
    setComment(String(editingDraft.comment ?? ''))
  }, [editingDraft, editingItemId])

  const result = useMemo(
    () =>
      calculateSpiralDuct({
        A,
        B,
        Q,
        material,
        thickness,
        spiralSectionLength,
      }),
    [A, B, Q, material, thickness, spiralSectionLength],
  )

  const description = useMemo(
    () =>
      buildDescription(i18n.t.bind(i18n), 'spiral-duct', {
        A,
        B,
        splitSummary: result.splitInfo?.summary,
        splitCount: result.splitInfo?.count,
        sectionLength: spiralSectionLength,
      }),
    [A, B, i18n, result.splitInfo?.count, result.splitInfo?.summary, spiralSectionLength],
  )

  const visibleMessages = filterMessagesByRole(result.messages, role)
  const guestLimitState = getGuestUsageLimitState()
  const guestLimitReached = isGuestRole(role) && guestLimitState.exhausted

  const handleAdd = () => {
    if (guestLimitReached) return
    const item = createSpecificationItem('spiral-duct')
    item.quantity = Q
    item.comment = comment
    item.parameters = { A, B, Q }
    item.options = { material, thickness, spiralSectionLength }
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

    if (isGuestRole(role)) {
      const nextUsage = incrementGuestUsage()
      setGuestUsageCount(nextUsage.count)
    }
  }

  const materialConfig = materialOptions.find((option) => option.key === material) ?? materialOptions[0]

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">SPIRAL-001 / {t('product.spiralDuct')}</h3>
            <p className="mt-1 text-sm text-slate-600">{t('product.spiralDuctDescription')}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <div className="font-medium text-slate-900">{t('common.splitSummary')}</div>
            <div className="mt-1">{result.splitInfo?.summary}</div>
          </div>
        </div>
        {isGuestRole(role) ? (
          <div className="mt-5">
            <Alert tone={guestLimitReached ? 'warning' : 'info'} title={t('message.guestLimit.title')}>
              {t('message.guestLimit.description', {
                limit: guestCalculationLimitPerDay,
                used: guestUsageCount,
                remaining: Math.max(guestCalculationLimitPerDay - guestUsageCount, 0),
              })}
            </Alert>
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <ParameterField label={camductMode && (role === 'admin' || role === 'service') ? 'A / ØD' : 'ØD'}>
            <input type="number" value={A} onChange={(e) => setA(Number(e.target.value || 0))} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </ParameterField>
          <ParameterField label={camductMode && (role === 'admin' || role === 'service') ? 'B / L' : 'L'}>
            <input type="number" value={B} onChange={(e) => setB(Number(e.target.value || 0))} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </ParameterField>
          <ParameterField label="Q">
            <input type="number" value={Q} onChange={(e) => setQ(Number(e.target.value || 1))} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </ParameterField>
          <ParameterField label={t('split.spiralBySelectedLength')}>
            <SectionLengthSelector value={spiralSectionLength} onChange={setSpiralSectionLength} />
          </ParameterField>
          <ParameterField label={t('common.material')}>
            <select value={material} onChange={(e) => setMaterial(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
              {materialOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {t(`material.${option.key}`)}
                </option>
              ))}
            </select>
          </ParameterField>
          <ParameterField label={t('common.thickness')}>
            <select value={thickness} onChange={(e) => setThickness(Number(e.target.value))} className="w-full rounded-lg border border-slate-300 px-3 py-2">
              {materialConfig.thicknesses.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </ParameterField>
        </div>

        <div className="mt-4">
          <ParameterField label={t('common.comment')}>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2" />
          </ParameterField>
        </div>

        <div className="mt-6">
          <button type="button" disabled={guestLimitReached} onClick={handleAdd} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">
            {editingItemId ? t('action.updateItem') : t('action.addToProject')}
          </button>
        </div>
      </div>

      <CalculatorResult area={result.calculated.areaDisplay} mass={result.calculated.massDisplay} description={description} />

      <MessageList messages={visibleMessages} />

      {(role === 'admin' || role === 'service') && <AdminDebugPanel data={{ camductMode, result }} />}
    </div>
  )
}
