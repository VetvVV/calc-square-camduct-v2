export type ModuleKey = 'round-duct' | 'spiral-duct'

export type MessageType = 'warning' | 'info' | 'error' | 'success' | 'debug'
export type MessageScope = 'calculation' | 'limit' | 'help' | 'debug'

export interface ParameterMeta {
  camductKey: string
  displaySymbol: string
  labelKey: string
  formulaSymbol: string
  unitKey: string
}

export interface SplitInfo {
  splitRequired: boolean
  sectionLength: number
  count: number
  sections: number[]
  summary: string
  hasRemainder: boolean
  remainder: number
}

export interface FormulaTraceStep {
  label: string
  value: string | number
}

export interface FormulaTrace {
  formulaKey: string
  steps: FormulaTraceStep[]
}

export interface CalculationResult {
  areaRaw: number
  areaDisplay: number
  massRaw: number | null
  massDisplay: number | null
  splitInfo?: SplitInfo
  trace?: FormulaTrace
}

export interface ModuleConfig {
  key: ModuleKey
  productCode: string
  category: 'round'
  parameterMeta: Record<string, ParameterMeta>
}
