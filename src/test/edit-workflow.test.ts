import { describe, expect, it } from 'vitest'
import { createEmptyProject, createSpecificationItem } from '../domain/specification/itemFactory'
import { addItem, replaceItem } from '../domain/specification/specificationManager'

describe('edit workflow baseline', () => {
  it('preserves spiral sectionLength and values on replace', () => {
    const project = createEmptyProject()
    const item = createSpecificationItem('spiral-duct')
    item.parameters = { A: 250, B: 14500, Q: 1 }
    item.options = { material: 'galvanized', thickness: 0.5, spiralSectionLength: 2000 }
    item.calculated = { areaRaw: 11.388273, areaDisplay: 11.388, massRaw: 44.69, massDisplay: 44.69 }
    item.moduleMetadata = {
      spiralSections: {
        sectionLength: 2000,
        count: 8,
        summary: '7×2000+500',
      },
    }

    const withItem = addItem(project, item)
    const edited = { ...item, comment: 'edited' }
    const replaced = replaceItem(withItem, item.id, edited)

    expect(replaced.items[0].parameters.A).toBe(250)
    expect(replaced.items[0].parameters.B).toBe(14500)
    expect(replaced.items[0].options.spiralSectionLength).toBe(2000)
    expect((replaced.items[0].moduleMetadata.spiralSections as { summary: string }).summary).toBe('7×2000+500')
    expect(replaced.items[0].calculated.areaDisplay).toBe(11.388)
    expect(replaced.items[0].comment).toBe('edited')
  })
})
