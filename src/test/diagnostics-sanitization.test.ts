import { describe, expect, it } from 'vitest'
import { createEmptyProject, createSpecificationItem } from '../domain/specification/itemFactory'
import { sanitizeCalculationOutputForRole, sanitizeProjectForRole } from '../security/diagnosticsSanitizer'
import type { ModuleCalculationOutput, SpecificationProject, UserRole } from '../types'

function createProjectWithDiagnostics(): SpecificationProject {
  const project = createEmptyProject()
  const item = createSpecificationItem('rect-duct')

  item.quantity = 2
  item.parameters = { A: 400, B: 300, L: 1000, Q: 2 }
  item.options = { material: 'galvanized', thickness: 0.5 }
  item.calculated = {
    areaRaw: 1.436,
    areaDisplay: 1.436,
    massRaw: 5.64,
    massDisplay: 5.64,
  }
  ;(item as unknown as Record<string, unknown>).trace = {
    formulaKey: 'rect-duct.item',
    steps: [{ label: 'Item top-level trace', value: 1 }],
  }
  ;(item as unknown as Record<string, unknown>).formulaKey = 'rect-duct.item'
  ;(item.calculated as unknown as Record<string, unknown>).trace = {
    formulaKey: 'rect-duct.area',
    steps: [{ label: 'Area raw', value: 1.436 }],
  }
  item.moduleMetadata = {
    rectangularDuct: {
      layout: 'ABAB',
      parts: 1,
      mainArea: 0.036,
      russianArea: 0,
      lockArea: 0.036,
      Z1: 6,
      Z2: 30,
      russianLockSize: 25,
      sheet: { width: 1245, length: 2960 },
      cleanArea: 1.4,
      perimeter: 1400,
    },
    roundSections: { summary: '2×1250+700' },
    spiralSections: { summary: '7×2000+500' },
    lockAllowance: 25,
    calculatedLength: 1010,
    welded: false,
    internalJointType: 'none',
    stripWidth: 154,
    stripWidthStatus: 'to_confirm',
    publicNote: 'kept',
  }
  item.messages = [
    {
      id: 'public-message',
      type: 'warning',
      scope: 'calculation',
      titleKey: 'message.roundSplit.title',
      descriptionKey: 'message.roundSplit.description',
      visibleTo: ['guest', 'user', 'client', 'admin', 'service'],
    },
    {
      id: 'debug-message',
      type: 'debug',
      scope: 'debug',
      titleKey: 'message.debug.title',
      descriptionKey: 'message.debug.description',
      visibleTo: ['admin', 'service'],
    },
  ]

  ;(project as unknown as Record<string, unknown>).trace = {
    formulaKey: 'project.trace',
    steps: [{ label: 'Project top-level trace', value: 1 }],
  }
  ;(project as unknown as Record<string, unknown>).formulaKey = 'project.trace'
  project.items.push(item)
  return project
}

function stringify(value: unknown) {
  return JSON.stringify(value)
}

describe('diagnostics sanitization', () => {
  it.each(['guest', 'user', 'client'] as const)('removes protected diagnostics for %s project data', (role) => {
    const sanitized = sanitizeProjectForRole(createProjectWithDiagnostics(), role)
    const raw = stringify(sanitized)

    for (const protectedKey of ['trace', 'formulaKey', 'steps', 'rectangularDuct', 'roundSections', 'spiralSections', 'lockAllowance', 'Z1', 'Z2', 'stripWidth']) {
      expect(raw).not.toContain(protectedKey)
    }
    expect(sanitized.items[0].messages).toHaveLength(1)
    expect(sanitized.items[0].moduleMetadata.publicNote).toBe('kept')
  })

  it('keeps public result and visible item fields unchanged', () => {
    const project = createProjectWithDiagnostics()
    const sanitized = sanitizeProjectForRole(project, 'guest')
    const item = sanitized.items[0]

    expect(item.moduleKey).toBe('rect-duct')
    expect(item.quantity).toBe(2)
    expect(item.parameters).toEqual({ A: 400, B: 300, L: 1000, Q: 2 })
    expect(item.options).toEqual({ material: 'galvanized', thickness: 0.5 })
    expect(item.moduleMetadata.publicNote).toBe('kept')
    expect(item.calculated).toEqual({
      areaRaw: 1.436,
      areaDisplay: 1.436,
      massRaw: 5.64,
      massDisplay: 5.64,
    })
  })

  it.each(['admin', 'service'] as const)('keeps protected runtime diagnostics for %s', (role) => {
    const project = createProjectWithDiagnostics()
    expect(sanitizeProjectForRole(project, role)).toBe(project)

    const output: ModuleCalculationOutput = {
      calculated: {
        areaRaw: 1.436,
        areaDisplay: 1.436,
        massRaw: 5.64,
        massDisplay: 5.64,
        trace: { formulaKey: 'rect-duct.area', steps: [{ label: 'Area raw', value: 1.436 }] },
      },
      moduleMetadata: { rectangularDuct: { Z1: 6, Z2: 30 } },
      messages: [],
      trace: { formulaKey: 'rect-duct.area', steps: [{ label: 'Lock area', value: 0.036 }] },
    }

    expect(sanitizeCalculationOutputForRole(output, role)).toBe(output)
  })

  it.each(['guest', 'user', 'client'] as UserRole[])('removes calculation trace from public calculation output for %s', (role) => {
    const output: ModuleCalculationOutput = {
      calculated: {
        areaRaw: 1.436,
        areaDisplay: 1.436,
        massRaw: 5.64,
        massDisplay: 5.64,
        trace: { formulaKey: 'rect-duct.area', steps: [{ label: 'Area raw', value: 1.436 }] },
      },
      moduleMetadata: { rectangularDuct: { Z1: 6, Z2: 30 }, publicNote: 'kept' },
      messages: [
        {
          id: 'debug-message',
          type: 'debug',
          scope: 'debug',
          titleKey: 'message.debug.title',
          descriptionKey: 'message.debug.description',
          visibleTo: ['admin', 'service'],
        },
      ],
      trace: { formulaKey: 'rect-duct.area', steps: [{ label: 'Lock area', value: 0.036 }] },
    }

    const sanitized = sanitizeCalculationOutputForRole(output, role)
    expect(stringify(sanitized)).not.toContain('trace')
    expect(stringify(sanitized)).not.toContain('formulaKey')
    expect(stringify(sanitized)).not.toContain('rectangularDuct')
    expect(sanitized.calculated.areaRaw).toBe(1.436)
    expect(sanitized.moduleMetadata.publicNote).toBe('kept')
    expect(sanitized.messages).toHaveLength(0)
  })

  it('handles missing legacy messages as an empty public list', () => {
    const project = createProjectWithDiagnostics()
    ;(project.items[0] as unknown as { messages?: null }).messages = null

    const sanitized = sanitizeProjectForRole(project, 'guest')
    expect(sanitized.items[0].messages).toEqual([])
  })
})
