import type { TFunction } from 'i18next'
import type { ModuleKey } from '../../types'
import { buildRoundDuctDescription } from './roundDuctDescription'
import { buildSpiralDuctDescription } from './spiralDuctDescription'

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

  return buildSpiralDuctDescription(t, {
    A: Number(data.A ?? 0),
    B: Number(data.B ?? 0),
    splitSummary: typeof data.splitSummary === 'string' ? data.splitSummary : undefined,
    splitCount: typeof data.splitCount === 'number' ? data.splitCount : undefined,
    sectionLength: typeof data.sectionLength === 'number' ? data.sectionLength : undefined,
  })
}
