import type { SpecificationItem } from '../../types'
import { useTranslation } from 'react-i18next'
import { buildDescription } from '../../domain/descriptions/descriptionBuilder'
import { formatArea, formatMass } from '../../utils/format'

interface SpecRowProps {
  index: number
  item: SpecificationItem
  onRemove: (itemId: string) => void
  onEdit: (item: SpecificationItem) => void
}

function buildSizeLabel(item: SpecificationItem, t: (key: string) => string) {
  const A = item.parameters.A
  const B = item.parameters.B
  if (typeof A === 'number' && typeof B === 'number') {
    return `ØD ${A} × L ${B} ${t('unit.mm')}`
  }
  return '—'
}

function materialLabel(material: unknown, t: (key: string) => string) {
  return typeof material === 'string' ? t(`material.${material}`) : '—'
}

export function SpecRow({ index, item, onRemove, onEdit }: SpecRowProps) {
  const { i18n, t } = useTranslation()

  const splitSummary =
    item.moduleKey === 'round-duct'
      ? typeof item.moduleMetadata?.roundSections === 'object' && item.moduleMetadata?.roundSections !== null
        ? (item.moduleMetadata.roundSections as { summary?: string; count?: number; sectionLength?: number })
        : undefined
      : typeof item.moduleMetadata?.spiralSections === 'object' && item.moduleMetadata?.spiralSections !== null
        ? (item.moduleMetadata.spiralSections as { summary?: string; count?: number; sectionLength?: number })
        : undefined

  const description = buildDescription(i18n.t.bind(i18n), item.moduleKey, {
    A: typeof item.parameters.A === 'number' ? item.parameters.A : 0,
    B: typeof item.parameters.B === 'number' ? item.parameters.B : 0,
    splitSummary: splitSummary?.summary,
    splitCount: splitSummary?.count,
    sectionLength: splitSummary?.sectionLength,
  })

  return (
    <tr>
      <td className="px-4 py-3">{index + 1}</td>
      <td className="px-4 py-3 font-medium text-slate-900">{item.moduleKey === 'round-duct' ? t('product.roundDuctStraight') : t('product.spiralDuct')}</td>
      <td className="px-4 py-3">{buildSizeLabel(item, t)}</td>
      <td className="px-4 py-3">{description}</td>
      <td className="px-4 py-3">{item.quantity}</td>
      <td className="px-4 py-3">{materialLabel(item.options.material, t)}</td>
      <td className="px-4 py-3">{item.options.thickness ?? '—'}</td>
      <td className="px-4 py-3">{formatArea(item.calculated.areaDisplay, t('unit.m2'))}</td>
      <td className="px-4 py-3">{formatMass(item.calculated.massDisplay, t('unit.kg'))}</td>
      <td className="px-4 py-3">{item.comment || '—'}</td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
          >
            Remove
          </button>
        </div>
      </td>
    </tr>
  )
}
