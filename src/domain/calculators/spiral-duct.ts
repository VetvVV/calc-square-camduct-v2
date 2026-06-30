import type { Message, ModuleCalculationOutput, UserRole } from '../../types'
import { splitSpiralDuct } from '../../utils/sectionSplit'
import { areaRound3, massRound2 } from './base'
import { createFormulaTrace } from './formulaTrace'

export interface SpiralDuctInput {
  A: number
  B: number
  Q?: number
  material?: string
  thickness?: number | null
  spiralSectionLength?: 6000 | 5000 | 4000 | 3000 | 2000
}

export function calculateSpiralDuct(input: SpiralDuctInput): ModuleCalculationOutput {
  const quantity = input.Q ?? 1
  const sectionLength = input.spiralSectionLength ?? 6000
  const areaRaw = (Math.PI * input.A * input.B * quantity) / 1_000_000
  const splitInfo = splitSpiralDuct(input.B, sectionLength)
  const massRaw =
    typeof input.thickness === 'number'
      ? areaRaw * (input.thickness / 1000) * 7850
      : null

  const visibleTo: UserRole[] = ['guest', 'user', 'client', 'admin', 'service']
  const messages: Message[] = splitInfo.splitRequired
    ? [
        {
          id: 'spiral.split.required',
          type: 'warning',
          scope: 'calculation',
          titleKey: 'message.spiralSplit.title',
          descriptionKey: splitInfo.hasRemainder
            ? 'message.spiralRemainder.description'
            : 'message.spiralSplit.description',
          descriptionParams: {
            count: splitInfo.count,
            sectionLength,
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
      trace: createFormulaTrace('spiral-duct.area', [
        { label: 'A', value: input.A },
        { label: 'B', value: input.B },
        { label: 'Q', value: quantity },
        { label: 'S', value: `${Math.PI} × ${input.A} × ${input.B} × ${quantity} / 1_000_000` },
      ]),
    },
    splitInfo,
    moduleMetadata: {
      spiralSections: {
        sectionLength,
        count: splitInfo.count,
        sections: splitInfo.sections,
        summary: splitInfo.summary,
        hasRemainder: splitInfo.hasRemainder,
        remainder: splitInfo.remainder,
      },
      stripWidth: 154,
      stripWidthStatus: 'to_confirm',
      spiralLockEdges: 2,
      spiralLockSeam: 'one_continuous_helical_lock',
      effectiveStripWidth: null,
      effectiveStripWidthStatus: 'open',
      stripConsumption: null,
      stripConsumptionStatus: 'open',
    },
    messages,
    trace: createFormulaTrace('spiral-duct.area', [
      { label: 'A', value: input.A },
      { label: 'B', value: input.B },
      { label: 'Q', value: quantity },
      { label: 'Area raw', value: areaRaw },
      { label: 'Split summary', value: splitInfo.summary },
    ]),
  }
}
