import type { Message } from './messages'
import type { CalculationResult, FormulaTrace, SplitInfo } from './module'

export interface ModuleCalculationOutput {
  calculated: CalculationResult
  splitInfo?: SplitInfo
  moduleMetadata: Record<string, unknown>
  messages: Message[]
  trace?: FormulaTrace
}
