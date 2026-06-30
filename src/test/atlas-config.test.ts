import { describe, expect, it } from 'vitest'
import { atlasConfig } from '../config/atlas'

describe('atlasConfig', () => {
  it('contains round family with R-001 and SPIRAL-001 variants', () => {
    const roundCategory = atlasConfig.find((category) => category.categoryKey === 'round')
    expect(roundCategory).toBeDefined()

    const family = roundCategory?.families.find((item) => item.familyKey === 'round-duct')
    expect(family).toBeDefined()
    expect(family?.variants.map((variant) => variant.code)).toEqual(['R-001', 'SPIRAL-001'])
    expect(family?.variants.map((variant) => variant.moduleKey)).toEqual(['round-duct', 'spiral-duct'])
  })
})
