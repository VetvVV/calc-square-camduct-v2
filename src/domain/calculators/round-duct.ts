import type { Message, ModuleCalculationOutput, UserRole } from '../../types'
import { splitRoundDuct } from '../../utils/sectionSplit'
import { areaRound3, massRound2 } from './base'
import { createFormulaTrace } from './formulaTrace'

export interface RoundDuctInput {
  A: number
  B: number
  quantity?: number
  material?: string
  thickness?: number | null
  C1?: 'none' | 'flange' | 'bandage' | string | null
  C2?: 'none' | 'flange' | 'bandage' | string | null
  internalJointType?: 'none' | 'nipple' | 'coupling' | 'overlap' | 'zig_tractor' | null
}

function roundAutoThickness(diameter: number) {
  if (diameter >= 1000) return 0.9
  if (diameter >= 500) return 0.7
  return 0.5
}

function roundConnectorAllowance(value?: string | null) {
  return value === 'flange' ? 10 : value === 'bandage' ? 7 : 0
}

export function calculateRoundDuct(input: RoundDuctInput): ModuleCalculationOutput {
  const quantity = input.quantity ?? 1
  const thickness = typeof input.thickness === 'number' ? input.thickness : roundAutoThickness(input.A)
  const c1 = roundConnectorAllowance(input.C1)
  const c2 = roundConnectorAllowance(input.C2)
  const calculatedLength = input.B + c1 + c2
  const welded = input.B <= 449
  const lockAllowance = welded ? 8 : thickness >= 0.9 ? 28 : 25
  const areaRaw = ((Math.PI * input.A + lockAllowance) * calculatedLength * quantity) / 1_000_000
  const splitInfo = splitRoundDuct(input.B)
  const massRaw = areaRaw * (thickness / 1000) * 7850

  const visibleTo: UserRole[] = ['guest', 'user', 'client', 'admin', 'service']
  const messages: Message[] = splitInfo.splitRequired
    ? [
        {
          id: 'round.split.required',
          type: 'warning',
          scope: 'calculation',
          titleKey: 'message.roundSplit.title',
          descriptionKey: 'message.roundSplit.description',
          descriptionParams: {
            count: splitInfo.count,
            sectionLength: splitInfo.sectionLength,
            summary: splitInfo.summary,
          },
          visibleTo,
        },
      ]
    : []

  return {
    calculated: {
      areaRaw,
      areaDisplay: areaRound3(areaRaw),
      massRaw,
      massDisplay: massRound2(massRaw),
      splitInfo,
      trace: createFormulaTrace('round-duct.area', [
        { label: 'A', value: input.A },
        { label: 'B', value: input.B },
        { label: 'Q', value: quantity },
        { label: 'C1 allowance', value: c1 },
        { label: 'C2 allowance', value: c2 },
        { label: 'Bcalc', value: calculatedLength },
        { label: 'Lock allowance', value: lockAllowance },
        { label: 'S', value: `(π × ${input.A} + ${lockAllowance}) × ${calculatedLength} × ${quantity} / 1_000_000` },
      ]),
    },
    splitInfo,
    moduleMetadata: {
      roundSections: {
        sectionLength: splitInfo.sectionLength,
        count: splitInfo.count,
        sections: splitInfo.sections,
        summary: splitInfo.summary,
        hasRemainder: splitInfo.hasRemainder,
        remainder: splitInfo.remainder,
      },
      endConnections: {
        C1: input.C1 ?? 'none',
        C2: input.C2 ?? 'none',
      },
      calculatedLength,
      lockAllowance,
      welded,
      internalJointType: input.internalJointType ?? null,
    },
    messages,
    trace: createFormulaTrace('round-duct.area', [
      { label: 'A', value: input.A },
      { label: 'B', value: input.B },
      { label: 'Q', value: quantity },
      { label: 'Thickness', value: thickness },
      { label: 'C1 allowance', value: c1 },
      { label: 'C2 allowance', value: c2 },
      { label: 'Calculated length', value: calculatedLength },
      { label: 'Lock allowance', value: lockAllowance },
      { label: 'Area raw', value: areaRaw },
    ]),
  }
}
