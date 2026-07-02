import { describe, expect, it } from 'vitest'
import i18n from '../i18n'
import { buildDescription } from '../domain/descriptions/descriptionBuilder'
import { formatArea, formatMass } from '../utils/format'

describe('presentation builders', () => {
  it('builds english spiral description without russian text', async () => {
    await i18n.changeLanguage('en')
    const text = buildDescription(i18n.t.bind(i18n), 'spiral-duct', {
      A: 250,
      B: 14500,
      splitCount: 3,
      splitSummary: '2×6000+2500',
      sectionLength: 6000,
    })

    expect(text).toContain('Spiral duct')
    expect(text).toContain('D 250 × L 14500 mm')
    expect(text).not.toContain('спирально-навивная')
    expect(text).not.toContain('Диаметр')
  })

  it('builds ukrainian spiral description', async () => {
    await i18n.changeLanguage('uk')
    const text = buildDescription(i18n.t.bind(i18n), 'spiral-duct', {
      A: 250,
      B: 14500,
      splitCount: 3,
      splitSummary: '2×6000+2500',
      sectionLength: 6000,
    })

    expect(text).toContain('Спірально-навивна труба')
  })

  it('builds rectangular duct description with visible C length label', async () => {
    await i18n.changeLanguage('ru')
    const text = buildDescription(i18n.t.bind(i18n), 'rect-duct', {
      A: 400,
      B: 300,
      L: 1000,
      thickness: 0.5,
      lockLabelKey: 'lock.american',
      lockSize: '6/30',
    })

    expect(text).toContain('A 400 × B 300 × C 1000 мм')
    expect(text).not.toContain('× L 1000')
  })

  it('formats area and mass', async () => {
    await i18n.changeLanguage('ru')
    expect(formatArea(47.124)).toMatch(/47[,.]124/)
    expect(formatMass(184.96)).toMatch(/184[,.]96/)
    expect(formatMass(null)).toBe('—')
    expect(formatArea(2.593)).not.toContain('NaN')

    await i18n.changeLanguage('uk')
    expect(formatArea(2.593)).not.toContain('NaN')
  })
})
