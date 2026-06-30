import type { FormulaTrace } from '../../types'

export function createFormulaTrace(formulaKey: string, steps: FormulaTrace['steps']): FormulaTrace {
  return {
    formulaKey,
    steps,
  }
}
