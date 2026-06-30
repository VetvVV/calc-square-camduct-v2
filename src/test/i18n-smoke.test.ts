import { describe, expect, it } from 'vitest'
import { en } from '../i18n/en'
import { ru } from '../i18n/ru'
import { uk } from '../i18n/uk'

describe('i18n smoke', () => {
  it('has localized labels in all languages', () => {
    expect(en.nav.atlas).toBe('Atlas')
    expect(ru.nav.atlas).toBe('Атлас')
    expect(uk.nav.atlas).toBe('Атлас')
  })

  it('localizes specification and calculator headings for ru', () => {
    const text = [
      ru.materials.title,
      ru.calculator.resultTitle,
      ru.summary.title,
      ru.summary.items,
      ru.summary.areaTotal,
      ru.summary.massTotal,
      ru.spec.item,
      ru.spec.sizes,
      ru.spec.description,
      ru.action.projectActionsTitle,
      ru.action.saveLocal,
      ru.action.openLocal,
      ru.action.exportJson,
      ru.action.importJson,
      ru.action.clearLocal,
    ].join(' ')

    expect(text).not.toContain('Material summary')
    expect(text).not.toContain('Calculation result')
    expect(text).not.toContain('Totals')
    expect(text).not.toContain('Items')
  })

  it('keeps en free of ru headings', () => {
    const text = [en.spec.title, en.spec.item, en.summary.title, en.materials.title, en.calculator.resultTitle].join(' ')

    expect(text).not.toContain('Проектная')
    expect(text).not.toContain('Изделие')
    expect(text).not.toContain('Итоги')
    expect(text).not.toContain('Сводка')
    expect(text).not.toContain('Результат')
  })

  it('keeps uk main headings localized', () => {
    const text = [uk.spec.title, uk.spec.item, uk.summary.title, uk.materials.title, uk.calculator.resultTitle].join(' ')

    expect(text).not.toContain('Project specification')
    expect(text).not.toContain('Material summary')
    expect(text).not.toContain('Calculation result')
    expect(text).not.toContain('Проектная')
    expect(text).not.toContain('Изделие')
    expect(text).not.toContain('Итоги')
  })
})