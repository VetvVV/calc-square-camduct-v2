import { describe, expect, it } from 'vitest'
import { formatSectionsSummary, splitRoundDuct, splitSpiralDuct } from '../utils/sectionSplit'

describe('formatSectionsSummary', () => {
  it('formats grouped sections compactly', () => {
    expect(formatSectionsSummary([6000])).toBe('6000')
    expect(formatSectionsSummary([6000, 6000])).toBe('2×6000')
    expect(formatSectionsSummary([6000, 6000, 2500])).toBe('2×6000+2500')
    expect(formatSectionsSummary([2000, 2000, 2000, 2000, 2000, 2000, 2000, 500])).toBe('7×2000+500')
  })
})

describe('splitRoundDuct', () => {
  it('splits round duct above 2000 by 1250', () => {
    const split = splitRoundDuct(3200)
    expect(split.sections).toEqual([1250, 1250, 700])
    expect(split.summary).toBe('2×1250+700')
    expect(split.count).toBe(3)
  })
})

describe('splitSpiralDuct', () => {
  it('keeps one section when length is not above section length', () => {
    const split = splitSpiralDuct(6000, 6000)
    expect(split.summary).toBe('6000')
    expect(split.count).toBe(1)
    expect(split.splitRequired).toBe(false)
  })

  it('splits by selected spiral section length', () => {
    expect(splitSpiralDuct(6000, 3000).summary).toBe('2×3000')
    expect(splitSpiralDuct(6000, 2000).summary).toBe('3×2000')
    expect(splitSpiralDuct(6000, 5000).summary).toBe('5000+1000')
    expect(splitSpiralDuct(14500, 6000).summary).toBe('2×6000+2500')
    expect(splitSpiralDuct(14500, 2000).summary).toBe('7×2000+500')
    expect(splitSpiralDuct(600000, 6000).summary).toBe('100×6000')
    expect(splitSpiralDuct(600000, 2000).summary).toBe('300×2000')
  })
})
