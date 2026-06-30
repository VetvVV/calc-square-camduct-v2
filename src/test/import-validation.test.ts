import { describe, expect, it } from 'vitest'
import { validateImportedProject } from '../data/importValidation'
import { createEmptyProject, createSpecificationItem } from '../domain/specification/itemFactory'

describe('import validation', () => {
  it('rejects unsupported moduleKey', () => {
    const project = createEmptyProject()
    const item = createSpecificationItem('round-duct')
    item.moduleKey = 'round-duct'
    project.items.push(item)

    const invalid = {
      ...project,
      items: [{ ...item, moduleKey: 'rectangular-duct' }],
    }

    const result = validateImportedProject(invalid as never)
    expect(result.valid).toBe(false)
    expect(result.issues[0]).toContain('Unsupported moduleKey')
  })
})
