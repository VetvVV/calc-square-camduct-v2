import { describe, expect, it } from 'vitest'
import roundDuctSource from '../domain/calculators/round-duct.ts?raw'
import spiralDuctSource from '../domain/calculators/spiral-duct.ts?raw'
import rectDuctSource from '../domain/calculators/rect-duct.ts?raw'
import type { TechnologyRuleSet } from '../config/technologyRules'

const factoryRuleSetExample = {
  id: 'factory-placeholder',
  version: '0.0.0-foundation',
  status: 'factory',
  source: 'factory',
  metadata: {
    name: 'Factory placeholder technology rules',
    note: 'Type-only example. Production constants are intentionally not connected to calculators.',
  },
  locks: {
    sizes: [
      {
        id: 'american-placeholder',
        type: 'american',
        label: 'American lock placeholder',
        dimension1Mm: 1.5,
        dimension2Mm: 1.5,
        validation: {
          status: 'requires-check',
          sourceNote: 'Placeholder values only. Not production constants.',
        },
      },
      {
        id: 'russian-placeholder',
        type: 'russian',
        label: 'Russian lock placeholder',
        dimension1Mm: 1.5,
        dimension2Mm: 1.5,
        internalDesignation: 'S1',
        validation: {
          status: 'requires-check',
          sourceNote: 'S1 is reserved as an optional internal designation, not a universal rule.',
        },
      },
    ],
    selectionRules: [
      {
        id: 'thin-material-placeholder',
        lockSizeId: 'american-placeholder',
        thicknessRange: {
          min: 0,
          max: 1,
          minInclusive: true,
          maxInclusive: false,
        },
        validation: {
          status: 'requires-check',
        },
      },
    ],
  },
} satisfies TechnologyRuleSet

describe('technology rules foundation', () => {
  it('can describe a factory rule set with metadata and lifecycle fields', () => {
    expect(factoryRuleSetExample.id).toBeTruthy()
    expect(factoryRuleSetExample.version).toBeTruthy()
    expect(factoryRuleSetExample.status).toBe('factory')
    expect(factoryRuleSetExample.source).toBe('factory')
    expect(factoryRuleSetExample.metadata.name).toBeTruthy()
  })

  it('allows lock sizes and selection rules to remain requires-check', () => {
    const lockSizes = factoryRuleSetExample.locks?.sizes ?? []
    const selectionRule = factoryRuleSetExample.locks?.selectionRules?.[0]

    expect(lockSizes.every((lockSize) => lockSize.validation.status === 'requires-check')).toBe(true)
    expect(selectionRule?.lockSizeId).toBe('american-placeholder')
    expect(selectionRule?.thicknessRange?.max).toBe(1)
    expect(selectionRule?.validation.status).toBe('requires-check')
  })

  it('is not imported by calculator files', () => {
    const calculatorSources = [roundDuctSource, spiralDuctSource, rectDuctSource]

    calculatorSources.forEach((content) => {
      expect(content).not.toContain('technologyRules')
      expect(content).not.toContain('TechnologyRuleSet')
    })
  })
})


