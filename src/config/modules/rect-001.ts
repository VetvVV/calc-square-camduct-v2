import { parameterColorTokens } from './parameterColors'
import type { ModuleConfig } from './types'

export const rect001ModuleConfig: ModuleConfig = {
  key: 'rect-duct',
  productCode: 'PRM-001',
  category: 'rectangular',
  publicTitle: 'Воздуховод прямоугольный',
  publicSubtitle: 'Модуль расчёта прямоугольного воздуховода',
  fields: [
    {
      key: 'width',
      publicLabel: 'Ширина',
      camductLabel: 'A',
      internalKey: 'width',
      type: 'number',
      defaultValue: 400,
      step: 1,
      unitDimension: 'length',
      colorToken: parameterColorTokens.width,
    },
    {
      key: 'height',
      publicLabel: 'Высота',
      camductLabel: 'B',
      internalKey: 'height',
      type: 'number',
      defaultValue: 300,
      step: 1,
      unitDimension: 'length',
      colorToken: parameterColorTokens.height,
    },
    {
      key: 'length',
      publicLabel: 'Длина',
      // TODO: CAMduct label C for length requires CAMduct confirmation.
      internalKey: 'length',
      type: 'number',
      defaultValue: 1000,
      step: 1,
      unitDimension: 'length',
      colorToken: parameterColorTokens.length,
    },
    {
      key: 'quantity',
      publicLabel: 'Количество',
      internalKey: 'quantity',
      type: 'number',
      defaultValue: 1,
      step: 1,
      unitDimension: 'count',
    },
  ],
  designations: {
    A: 'width',
    B: 'height',
  },
  formula: {
    key: 'rect-duct',
    description: 'PRM-001 rectangular duct formula is implemented in the domain calculator and is not wired through this config yet.',
    version: 'foundation',
  },
}

