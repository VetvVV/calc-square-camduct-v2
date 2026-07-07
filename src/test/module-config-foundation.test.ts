import { describe, expect, it } from 'vitest'
import { rect001ModuleConfig } from '../config/modules'

describe('module config foundation', () => {
  it('defines PRM-001 without using CAMduct designations as public labels', () => {
    expect(rect001ModuleConfig.key).toBe('rect-duct')
    expect(rect001ModuleConfig.productCode).toBe('PRM-001')
    expect(rect001ModuleConfig.publicSubtitle).toContain('Модуль расчёта')
    expect(rect001ModuleConfig.publicSubtitle).not.toContain('Калькулятор')

    expect(rect001ModuleConfig.fields).not.toHaveLength(0)
    rect001ModuleConfig.fields.forEach((field) => {
      expect(field.internalKey).toBeTruthy()
      expect(field.publicLabel).toBeTruthy()
      expect(field.publicLabel).not.toMatch(/^[ABC]$/)
    })
  })

  it('contains only confirmed CAMduct designations for PRM-001', () => {
    expect(rect001ModuleConfig.designations).toEqual({
      A: 'width',
      B: 'height',
    })
    expect(rect001ModuleConfig.designations).not.toHaveProperty('C')
  })
})

