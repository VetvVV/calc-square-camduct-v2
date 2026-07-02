import type { TFunction } from 'i18next'

export interface SpiralDuctDescriptionInput {
  A: number
  B: number
  splitSummary?: string
  splitCount?: number
  sectionLength?: number
}

export function buildSpiralDuctDescription(t: TFunction, input: SpiralDuctDescriptionInput) {
  const base = `D ${input.A} × L ${input.B} ${t('unit.mm')} · ${t('product.spiralDuct')}`

  if (!input.splitCount || input.splitCount <= 1 || !input.splitSummary || !input.sectionLength) {
    return base
  }

  return `${base}; ${t('split.sections')}: ${input.splitCount} ${t('split.by')} ${input.sectionLength}: ${input.splitSummary}`
}
