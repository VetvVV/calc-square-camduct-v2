import { describe, expect, it } from 'vitest'
import { calculateRoundDuct } from '../domain/calculators'

describe('calculateRoundDuct', () => {
  it('matches control value for A=250, B=1000', () => {
    const result = calculateRoundDuct({ A: 250, B: 1000, quantity: 1, C1: 'none', C2: 'none' })
    expect(result.calculated.areaDisplay).toBe(0.81)
  })

  it('matches control value for A=250, B=3200 and split', () => {
    const result = calculateRoundDuct({ A: 250, B: 3200, quantity: 1, C1: 'none', C2: 'none' })
    expect(result.calculated.areaDisplay).toBe(2.593)
    expect(result.splitInfo?.summary).toBe('2×1250+700')
    expect(result.splitInfo?.count).toBe(3)
  })
})
