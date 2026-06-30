import { describe, expect, it } from 'vitest'
import { createSpecificationItem } from '../domain/specification/itemFactory'
import { addItem, removeItem } from '../domain/specification/specificationManager'
import { createEmptyProject } from '../domain/specification/itemFactory'

describe('specification UI integration contract', () => {
  it('adds and removes project items through specification manager', () => {
    const project = createEmptyProject()
    const item = createSpecificationItem('spiral-duct')
    item.quantity = 1
    item.parameters = { A: 250, B: 14500, Q: 1 }
    item.options = { material: 'galvanized', thickness: 0.5, spiralSectionLength: 2000 }
    item.calculated = { areaRaw: 11.388, areaDisplay: 11.388, massRaw: 44.7, massDisplay: 44.7 }

    const nextProject = addItem(project, item)
    expect(nextProject.items).toHaveLength(1)
    expect(nextProject.metadata?.totals?.itemCount).toBe(1)

    const removed = removeItem(nextProject, item.id)
    expect(removed.items).toHaveLength(0)
    expect(removed.metadata?.totals?.itemCount).toBe(0)
  })
})
