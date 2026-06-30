import { describe, expect, it } from 'vitest'
import { calculateSpiralDuct } from '../domain/calculators'

describe('spiral duct UI contract baseline', () => {
  it('returns result payload needed for SPIRAL-001 UI', () => {
    const result = calculateSpiralDuct({
      A: 250,
      B: 14500,
      Q: 1,
      thickness: 0.5,
      spiralSectionLength: 2000,
    })

    expect(result.calculated.areaDisplay).toBe(11.388)
    expect(result.splitInfo?.summary).toBe('7×2000+500')
    expect(result.splitInfo?.count).toBe(8)
    expect(result.moduleMetadata).toHaveProperty('spiralSections')
  })
})
