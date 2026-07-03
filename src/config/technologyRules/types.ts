export type TechnologyRuleSetStatus = 'factory' | 'draft' | 'active' | 'archived'
export type TechnologyRuleSource = 'factory' | 'custom'
export type TechnologyRuleValidationStatus = 'confirmed' | 'requires-check' | 'deprecated'
export type LockType = 'american' | 'russian'
export type SplitRuleMode = 'fixed-length' | 'selectable-length' | 'sheet-layout'

export interface TechnologyRuleMetadata {
  name: string
  description?: string
  createdBy?: string
  updatedBy?: string
  createdAt?: string
  updatedAt?: string
  note?: string
}

export interface ValidationState {
  status: TechnologyRuleValidationStatus
  sourceNote?: string
  reviewedAt?: string
}

export interface LockSize {
  id: string
  type: LockType
  label: string
  dimension1Mm?: number
  dimension2Mm?: number
  internalDesignation?: string
  validation: ValidationState
}

export interface ThicknessRange {
  min?: number
  max?: number
  minInclusive?: boolean
  maxInclusive?: boolean
}

export interface LockSelectionRule {
  id: string
  lockSizeId: string
  thicknessRange?: ThicknessRange
  lengthRange?: ThicknessRange
  internalDesignation?: string
  validation: ValidationState
}

export interface ConnectorAllowance {
  id: string
  connectorKey: string
  allowanceMm: number
  validation: ValidationState
}

export interface SheetSizeLimit {
  id: string
  widthMm: number
  lengthMm: number
  validation: ValidationState
}

export interface SplitRule {
  id: string
  mode: SplitRuleMode
  defaultLengthMm?: number
  allowedLengthsMm?: number[]
  thresholdLengthMm?: number
  validation: ValidationState
}

export interface MaterialDensityRule {
  id: string
  materialKey: string
  densityKgM3: number
  validation: ValidationState
}

export interface TechnologyRuleSet {
  id: string
  version: string
  status: TechnologyRuleSetStatus
  source: TechnologyRuleSource
  metadata: TechnologyRuleMetadata
  locks?: {
    sizes?: LockSize[]
    selectionRules?: LockSelectionRule[]
  }
  connectorAllowances?: ConnectorAllowance[]
  sheetSizeLimits?: SheetSizeLimit[]
  splitRules?: SplitRule[]
  materialDensities?: MaterialDensityRule[]
}

