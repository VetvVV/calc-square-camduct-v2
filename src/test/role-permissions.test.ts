import { describe, expect, it } from 'vitest'
import {
  canAddSpecItem,
  canEditSpecItem,
  canExportProject,
  canImportProject,
  canPrintProject,
  canRemoveSpecItem,
  canUseProjectFiles,
  canViewCamductMode,
  canViewCalculator,
  canViewDebugPanel,
  canViewFormulaDetails,
  canViewInternalLogic,
  canViewSpecification,
  getCalculationLimit,
} from '../roles/permissions'

describe('role permission matrix', () => {
  it('keeps guest in calculator preview mode without specification or add access', () => {
    expect(canViewCalculator('guest')).toBe(true)
    expect(canViewSpecification('guest')).toBe(false)
    expect(canAddSpecItem('guest')).toBe(false)
    expect(getCalculationLimit('guest')).toBe(5)
    expect(canUseProjectFiles('guest')).toBe(false)
    expect(canViewDebugPanel('guest')).toBe(false)
  })

  it('allows user specification and add access with edit/export locked', () => {
    expect(canViewSpecification('user')).toBe(true)
    expect(canAddSpecItem('user')).toBe(true)
    expect(getCalculationLimit('user')).toBe(20)
    expect(canEditSpecItem('user')).toBe(false)
    expect(canRemoveSpecItem('user')).toBe(false)
    expect(canExportProject('user')).toBe(false)
    expect(canImportProject('user')).toBe(false)
    expect(canPrintProject('user')).toBe(false)
  })

  it('allows client project editing without internal diagnostics', () => {
    expect(canAddSpecItem('client')).toBe(true)
    expect(canEditSpecItem('client')).toBe(true)
    expect(canRemoveSpecItem('client')).toBe(true)
    expect(canExportProject('client')).toBe(true)
    expect(canImportProject('client')).toBe(true)
    expect(canViewInternalLogic('client')).toBe(false)
    expect(canViewFormulaDetails('client')).toBe(false)
    expect(canViewDebugPanel('client')).toBe(false)
  })

  it('allows service and admin internal CAMduct/debug access', () => {
    for (const role of ['service', 'admin'] as const) {
      expect(canUseProjectFiles(role)).toBe(true)
      expect(canPrintProject(role)).toBe(true)
      expect(canViewCamductMode(role)).toBe(true)
      expect(canViewDebugPanel(role)).toBe(true)
      expect(canViewInternalLogic(role)).toBe(true)
      expect(canViewFormulaDetails(role)).toBe(true)
      expect(getCalculationLimit(role)).toBeNull()
    }
  })
})
