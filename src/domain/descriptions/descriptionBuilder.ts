import type { TFunction } from 'i18next'
import type { ModuleKey } from '../../types'
import { buildRoundDuctDescription } from './roundDuctDescription'
import { buildSpiralDuctDescription } from './spiralDuctDescription'
import { buildRectDuctDescription } from './rectDuctDescription'

export function buildDescription(
  t: TFunction,
  moduleKey: ModuleKey,
  data: Record<string, number | string | undefined>,
) {
  if (moduleKey === 'round-duct') {
    return buildRoundDuctDescription(t, {
      A: Number(data.A ?? 0),
      B: Number(data.B ?? 0),
      splitSummary: typeof data.splitSummary === 'string' ? data.splitSummary : undefined,
      splitCount: typeof data.splitCount === 'number' ? data.splitCount : undefined,
    })
  }

  if (moduleKey === 'spiral-duct') {
    return buildSpiralDuctDescription(t, {
      A: Number(data.A ?? 0),
      B: Number(data.B ?? 0),
      splitSummary: typeof data.splitSummary === 'string' ? data.splitSummary : undefined,
      splitCount: typeof data.splitCount === 'number' ? data.splitCount : undefined,
      sectionLength: typeof data.sectionLength === 'number' ? data.sectionLength : undefined,
    })
  }

  return buildRectDuctDescription(t, {
    A: Number(data.A ?? 0),
    B: Number(data.B ?? 0),
    L: Number(data.L ?? 0),
    thickness: Number(data.thickness ?? 0.5),
    lockLabelKey: typeof data.lockLabelKey === 'string' ? data.lockLabelKey : undefined,
    lockSize: typeof data.lockSize === 'string' ? data.lockSize : undefined,
    layout: typeof data.layout === 'string' ? data.layout : undefined,
    russianLocks: typeof data.russianLocks === 'number' ? data.russianLocks : undefined,
  })
}
