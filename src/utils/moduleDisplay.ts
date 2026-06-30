import type { ModuleKey, ParameterMeta } from '../types'
import { i18nKeys } from '../i18n/keys'

export const moduleParameterMeta: Record<ModuleKey, Record<string, ParameterMeta>> = {
  'round-duct': {
    A: {
      camductKey: 'A',
      displaySymbol: 'ØD',
      labelKey: i18nKeys.dimension.diameter,
      formulaSymbol: 'D',
      unitKey: i18nKeys.unit.mm,
    },
    B: {
      camductKey: 'B',
      displaySymbol: 'L',
      labelKey: i18nKeys.dimension.length,
      formulaSymbol: 'L',
      unitKey: i18nKeys.unit.mm,
    },
  },
  'spiral-duct': {
    A: {
      camductKey: 'A',
      displaySymbol: 'ØD',
      labelKey: i18nKeys.dimension.diameter,
      formulaSymbol: 'D',
      unitKey: i18nKeys.unit.mm,
    },
    B: {
      camductKey: 'B',
      displaySymbol: 'L',
      labelKey: i18nKeys.dimension.length,
      formulaSymbol: 'L',
      unitKey: i18nKeys.unit.mm,
    },
    Q: {
      camductKey: 'Q',
      displaySymbol: 'Q',
      labelKey: i18nKeys.common.quantity,
      formulaSymbol: 'Q',
      unitKey: i18nKeys.unit.pcs,
    },
  },
}
