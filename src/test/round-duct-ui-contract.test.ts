import { describe, expect, it } from 'vitest'
import { calculateRoundDuct } from '../domain/calculators'

describe('round duct UI contract baseline', () => {
  it('returns result payload needed for R-001 UI', () => {
    const result = calculateRoundDuct({
      A: 250,
      B: 3200,
      quantity: 1,
      C1: 'none',
      C2: 'none',
      thickness: 0.5,
      internalJointType: 'none',
    })

    expect(result.calculated.areaDisplay).toBe(2.593)
    expect(result.splitInfo?.summary).toBe('2×1250+700')
    expect(result.moduleMetadata).toHaveProperty('endConnections')
    expect(result.moduleMetadata).toHaveProperty('internalJointType')
    expect(result.moduleMetadata).toHaveProperty('roundSections')
    expect((result.moduleMetadata.roundSections as { summary: string }).summary).toBe('2×1250+700')
  })
})
