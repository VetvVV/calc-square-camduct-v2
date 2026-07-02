import type { ModuleKey, ParameterMeta } from '../types'
import { i18nKeys } from '../i18n/keys'

export const moduleParameterMeta: Record<ModuleKey, Record<string, ParameterMeta>> = {
  'round-duct': {
    A: {
      camductKey: 'A',
      displaySymbol: 'D',
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
  'rect-duct': {
    A: {
      camductKey: 'A',
      displaySymbol: 'A',
      labelKey: 'parameter.widthLabel',
      formulaSymbol: 'A',
      unitKey: i18nKeys.unit.mm,
    },
    B: {
      camductKey: 'B',
      displaySymbol: 'B',
      labelKey: 'parameter.heightLabel',
      formulaSymbol: 'B',
      unitKey: i18nKeys.unit.mm,
    },
    L: {
      camductKey: 'L',
      displaySymbol: 'L',
      labelKey: 'parameter.rectLengthLabel',
      formulaSymbol: 'L',
      unitKey: i18nKeys.unit.mm,
    },
    T: {
      camductKey: 'T',
      displaySymbol: 'T',
      labelKey: i18nKeys.common.thickness,
      formulaSymbol: 'T',
      unitKey: i18nKeys.unit.mm,
    },
    Q: {
      camductKey: 'Q',
      displaySymbol: 'Q',
      labelKey: i18nKeys.common.quantity,
      formulaSymbol: 'Q',
      unitKey: i18nKeys.unit.pcs,
    },
  },  'spiral-duct': {
    A: {
      camductKey: 'A',
      displaySymbol: 'D',
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

