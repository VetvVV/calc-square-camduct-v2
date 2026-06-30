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
    expect(text).toContain('ØD 250 × L 14500 mm')
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
