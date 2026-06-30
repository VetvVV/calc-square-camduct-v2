import type { TFunction } from 'i18next'

export interface RoundDuctDescriptionInput {
  A: number
  B: number
  splitSummary?: string
  splitCount?: number
}

export function buildRoundDuctDescription(t: TFunction, input: RoundDuctDescriptionInput) {
  const base = `ØD ${input.A} × L ${input.B} ${t('unit.mm')} · ${t('product.roundDuctStraight')}`

  if (!input.splitCount || input.splitCount <= 1 || !input.splitSummary) {
    return base
  }

  return `${base}; ${t('split.sections')}: ${input.splitCount} ${t('split.by')} 1250: ${input.splitSummary}`
}
