import { describe, expect, it } from 'vitest'
import { calculateRectDuct } from '../domain/calculators'

describe('rectangular duct calculation baseline', () => {
  it('matches RECT-001 default baseline with raw area kept for storage', () => {
    const result = calculateRectDuct({ A: 400, B: 300, L: 1000, T: 0.5, Q: 1 })
    const meta = result.moduleMetadata.rectangularDuct as Record<string, unknown>

    expect(result.calculated.areaDisplay).toBe(1.436)
    expect(result.calculated.areaRaw).toBeCloseTo(1.436, 6)
    expect(result.calculated.massDisplay).toBe(5.64)
    expect(meta.layout).toBe('ABAB')
    expect(meta.parts).toBe(1)
    expect(meta.cleanArea).toBeCloseTo(1.4, 6)
    expect(meta.mainArea).toBeCloseTo(0.036, 6)
    expect(meta.russianArea).toBe(0)
  })

  it('uses welding allowance for short L <= 200', () => {
    const result = calculateRectDuct({ A: 400, B: 300, L: 200, T: 0.5, Q: 1 })
    const meta = result.moduleMetadata.rectangularDuct as Record<string, unknown>

    expect(meta.lockLabelKey).toBe('lock.welded')
    expect(meta.Z1).toBe(15)
    expect(meta.Z2).toBe(0)
  })

  it('uses 5/28 American lock for T >= 0.9', () => {
    const result = calculateRectDuct({ A: 400, B: 300, L: 1000, T: 0.9, Q: 1 })
    const meta = result.moduleMetadata.rectangularDuct as Record<string, unknown>

    expect(meta.lockLabelKey).toBe('lock.american')
    expect(meta.Z1).toBe(5)
    expect(meta.Z2).toBe(28)
    expect(meta.lockSize).toBe('5/28')
  })

  it('selects ABA + B layout when ABAB does not fit but ABA does', () => {
    const result = calculateRectDuct({ A: 400, B: 300, L: 2000, T: 0.5, Q: 1 })
    const meta = result.moduleMetadata.rectangularDuct as Record<string, unknown>

    expect(meta.layout).toBe('ABA + B')
    expect(meta.parts).toBe(2)
  })

  it('adds Russian split locks when a four-part large duct requires them', () => {
    const result = calculateRectDuct({ A: 1300, B: 1700, L: 1000, T: 0.5, Q: 1 })
    const meta = result.moduleMetadata.rectangularDuct as Record<string, unknown>

    expect(meta.layout).toBe('A + B + A + B')
    expect(meta.parts).toBe(4)
    expect(meta.russianLocks).toBe(4)
    expect(Number(meta.russianArea)).toBeGreaterThan(0)
  })
})

