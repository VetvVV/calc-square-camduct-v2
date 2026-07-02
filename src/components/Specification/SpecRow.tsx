import type { SpecificationItem } from '../../types'
import { useTranslation } from 'react-i18next'
import { buildDescription } from '../../domain/descriptions/descriptionBuilder'
import { formatArea, formatMass } from '../../utils/format'

interface SpecRowProps {
  index: number
  item: SpecificationItem
  onRemove: (itemId: string) => void
  onEdit: (item: SpecificationItem) => void
  canEdit: boolean
  canRemove: boolean
  onLockedAction: () => void
}

function buildSizeLabel(item: SpecificationItem, t: (key: string) => string) {
  const A = item.parameters.A
  const B = item.parameters.B
  const L = item.parameters.L

  if (item.moduleKey === 'rect-duct' && typeof A === 'number' && typeof B === 'number' && typeof L === 'number') {
    return `A ${A} × B ${B} × L ${L} ${t('unit.mm')}`
  }

  if (typeof A === 'number' && typeof B === 'number') {
    return `D ${A} × L ${B} ${t('unit.mm')}`
  }

  return '—'
}

function materialLabel(material: unknown, t: (key: string) => string) {
  return typeof material === 'string' ? t(`material.${material}`) : '—'
}

function productLabel(item: SpecificationItem, t: (key: string) => string) {
  if (item.moduleKey === 'round-duct') return t('product.roundDuctStraight')
  if (item.moduleKey === 'spiral-duct') return t('product.spiralDuct')
  return t('product.rectDuct')
}

export function SpecRow({ index, item, onRemove, onEdit, canEdit, canRemove, onLockedAction }: SpecRowProps) {
  const { i18n, t } = useTranslation()

  const splitSummary =
    item.moduleKey === 'round-duct'
      ? typeof item.moduleMetadata?.roundSections === 'object' && item.moduleMetadata?.roundSections !== null
        ? (item.moduleMetadata.roundSections as { summary?: string; count?: number; sectionLength?: number })
        : undefined
      : item.moduleKey === 'spiral-duct'
        ? typeof item.moduleMetadata?.spiralSections === 'object' && item.moduleMetadata?.spiralSections !== null
          ? (item.moduleMetadata.spiralSections as { summary?: string; count?: number; sectionLength?: number })
          : undefined
        : undefined

  const rectMeta =
    item.moduleKey === 'rect-duct' && typeof item.moduleMetadata?.rectangularDuct === 'object' && item.moduleMetadata?.rectangularDuct !== null
      ? (item.moduleMetadata.rectangularDuct as { lockLabelKey?: string; lockSize?: string; layout?: string; russianLocks?: number })
      : undefined

  const description = buildDescription(i18n.t.bind(i18n), item.moduleKey, {
    A: typeof item.parameters.A === 'number' ? item.parameters.A : 0,
    B: typeof item.parameters.B === 'number' ? item.parameters.B : 0,
    L: typeof item.parameters.L === 'number' ? item.parameters.L : 0,
    thickness: typeof item.options.thickness === 'number' ? item.options.thickness : 0.5,
    splitSummary: splitSummary?.summary,
    splitCount: splitSummary?.count,
    sectionLength: splitSummary?.sectionLength,
    lockLabelKey: rectMeta?.lockLabelKey,
    lockSize: rectMeta?.lockSize,
    layout: rectMeta?.layout,
    russianLocks: rectMeta?.russianLocks,
  })

  return (
    <tr>
      <td className="px-3 py-2 text-center">{index + 1}</td>
      <td className="px-3 py-2 font-extrabold text-[var(--brand-ink)]">{productLabel(item, t)}</td>
      <td className="px-3 py-2">{buildSizeLabel(item, t)}</td>
      <td className="px-3 py-2">{description}</td>
      <td className="px-3 py-2">{item.quantity}</td>
      <td className="px-3 py-2">{materialLabel(item.options.material, t)}</td>
      <td className="px-3 py-2">{item.options.thickness ?? '—'}</td>
      <td className="px-3 py-2">{formatArea(item.calculated.areaDisplay, t('unit.m2'))}</td>
      <td className="px-3 py-2">{formatMass(item.calculated.massDisplay, t('unit.kg'))}</td>
      <td className="px-3 py-2">{item.comment || '—'}</td>
      <td className="px-3 py-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => (canEdit ? onEdit(item) : onLockedAction())}
            className="brand-mini-button"
            title="Edit"
            aria-disabled={!canEdit}
          >
            ✎
          </button>
          <button
            type="button"
            onClick={() => (canRemove ? onRemove(item.id) : onLockedAction())}
            className="brand-mini-button danger"
            title="Remove"
            aria-disabled={!canRemove}
          >
            ×
          </button>
        </div>
      </td>
    </tr>
  )
}
