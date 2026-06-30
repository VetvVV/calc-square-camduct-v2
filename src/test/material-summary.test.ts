import { describe, expect, it } from 'vitest'
import { calculateMaterialSummary } from '../domain/specification/materials'
import { createSpecificationItem } from '../domain/specification/itemFactory'

describe('calculateMaterialSummary', () => {
  it('aggregates by material and thickness', () => {
    const a = createSpecificationItem('round-duct')
    a.options = { material: 'galvanized', thickness: 0.5 }
    a.calculated = { areaRaw: 2.5, areaDisplay: 2.5, massRaw: 9.8, massDisplay: 9.8 }

    const b = createSpecificationItem('spiral-duct')
    b.options = { material: 'galvanized', thickness: 0.5 }
    b.calculated = { areaRaw: 3.5, areaDisplay: 3.5, massRaw: 12.1, massDisplay: 12.1 }

    const c = createSpecificationItem('spiral-duct')
    c.options = { material: 'ss304', thickness: 0.8 }
    c.calculated = { areaRaw: 1.2, areaDisplay: 1.2, massRaw: 7.3, massDisplay: 7.3 }

    const summary = calculateMaterialSummary([a, b, c])
    expect(summary).toHaveLength(2)
    expect(summary.find((row) => row.material === 'galvanized')?.areaTotal).toBe(6)
    expect(summary.find((row) => row.material === 'galvanized')?.itemCount).toBe(2)
  })
})
