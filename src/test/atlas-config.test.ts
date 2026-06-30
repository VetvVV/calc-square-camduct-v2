import { describe, expect, it } from 'vitest'
import { atlasConfig } from '../config/atlas'

describe('atlasConfig', () => {
  it('contains a round catalog grid with active and coming soon products', () => {
    const roundCategory = atlasConfig.find((category) => category.categoryKey === 'round')
    expect(roundCategory).toBeDefined()
    expect(roundCategory?.items).toHaveLength(14)

    const activeItems = roundCategory?.items.filter((item) => item.status === 'available') ?? []
    expect(activeItems.map((item) => item.code)).toEqual(['R-001', 'SPIRAL-001'])
    expect(activeItems.map((item) => item.moduleKey)).toEqual(['round-duct', 'spiral-duct'])

    const futureItems = roundCategory?.items.filter((item) => item.status === 'coming_soon') ?? []
    expect(futureItems).toHaveLength(12)
    expect(futureItems.every((item) => item.moduleKey === undefined)).toBe(true)
    expect(futureItems.map((item) => item.code)).toContain('R-013')
  })
})