import type { ModuleKey } from '../../types'

export type ModuleFieldType = 'number' | 'select' | 'text' | 'textarea' | 'boolean'
export type ModuleFieldUnitDimension = 'length' | 'angle' | 'count' | 'none'
export type ModuleCategory = 'round' | 'rectangular' | 'combined'

export interface ModuleFieldConfig {
  key: string
  publicLabel: string
  camductLabel?: string
  internalKey: string
  type: ModuleFieldType
  defaultValue?: string | number | boolean | null
  step?: number
  unitDimension: ModuleFieldUnitDimension
  colorToken?: string
}

export interface ModuleVisualConfig {
  image?: string
  colorToken?: string
  icon?: string
}

export interface ModuleFormulaConfig {
  key: string
  description?: string
  version?: string
}

export interface ModuleConfig {
  key: ModuleKey
  productCode: string
  category: ModuleCategory
  publicTitle: string
  publicSubtitle: string
  fields: ModuleFieldConfig[]
  designations: Record<string, string>
  visual?: ModuleVisualConfig
  formula?: ModuleFormulaConfig
}

