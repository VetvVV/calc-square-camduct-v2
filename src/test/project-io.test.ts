import { describe, expect, it } from 'vitest'
import { createEmptyProject, createSpecificationItem } from '../domain/specification/itemFactory'
import { serializeProject, deserializeProject } from '../data/serialization'
import { validateImportedProject } from '../data/importValidation'
import { validateProjectForExport } from '../data/exportValidation'
import { migrateImportedProject } from '../data/migrations'

describe('project io', () => {
  it('serializes and validates project json', () => {
    const project = createEmptyProject()
    const item = createSpecificationItem('spiral-duct')
    item.parameters = { A: 250, B: 14500, Q: 1 }
    item.options = { material: 'galvanized', thickness: 0.5, spiralSectionLength: 2000 }
    item.moduleMetadata = {
      spiralSections: {
        sectionLength: 2000,
        count: 8,
        summary: '7×2000+500',
      },
    }
    project.items.push(item)

    const raw = serializeProject(project)
    const parsed = deserializeProject(raw)
    const imported = validateImportedProject(parsed)
    const exported = validateProjectForExport(project)

    expect(imported.valid).toBe(true)
    expect(exported.valid).toBe(true)
    expect(migrateImportedProject(parsed as never).items[0].options.spiralSectionLength).toBe(2000)
  })
})
