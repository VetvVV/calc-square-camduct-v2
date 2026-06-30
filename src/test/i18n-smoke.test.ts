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
})
