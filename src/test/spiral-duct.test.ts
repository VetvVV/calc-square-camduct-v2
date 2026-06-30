import { describe, expect, it } from 'vitest'
import { calculateSpiralDuct } from '../domain/calculators'

describe('calculateSpiralDuct', () => {
  it('matches control value for A=250, B=6000, Q=1', () => {
    const result = calculateSpiralDuct({ A: 250, B: 6000, Q: 1 })
    expect(result.calculated.areaDisplay).toBe(4.712)
  })

  it('matches control value for A=250, B=6500, Q=1', () => {
    const result = calculateSpiralDuct({ A: 250, B: 6500, Q: 1 })
    expect(result.calculated.areaDisplay).toBe(5.105)
  })

  it('matches control value for A=250, B=14500, Q=1', () => {
    const result = calculateSpiralDuct({ A: 250, B: 14500, Q: 1, spiralSectionLength: 2000 })
    expect(result.calculated.areaDisplay).toBe(11.388)
    expect(result.splitInfo?.summary).toBe('7×2000+500')
    expect(result.splitInfo?.count).toBe(8)
  })

  it('matches control value for long branches', () => {
    expect(calculateSpiralDuct({ A: 250, B: 60000, Q: 1 }).calculated.areaDisplay).toBe(47.124)
    expect(calculateSpiralDuct({ A: 250, B: 600000, Q: 1 }).calculated.areaDisplay).toBe(471.239)
  })
})
