import type { TFunction } from 'i18next'

export interface RectDuctDescriptionInput {
  A: number
  B: number
  L: number
  thickness: number
  lockLabelKey?: string
  lockSize?: string
  layout?: string
  russianLocks?: number
}

export function buildRectDuctDescription(t: TFunction, input: RectDuctDescriptionInput) {
  const lockLabel = input.lockLabelKey ? t(input.lockLabelKey) : ''
  const lock = lockLabel && input.lockSize ? ` · ${lockLabel} ${input.lockSize}` : lockLabel ? ` · ${lockLabel}` : ''
  const russianLock = input.russianLocks && input.russianLocks > 0 ? ` · ${t('lock.russian')} ${input.russianLocks}` : ''

  return `A ${input.A} × B ${input.B} × L ${input.L} ${t('unit.mm')} · ${t('common.thickness')} ${input.thickness} ${t('unit.mm')} · ${t('product.rectDuct')}${lock}${russianLock}`
}
