import { describe, expect, it } from 'vitest'
import i18n from '../i18n'
import { buildDescription } from '../domain/descriptions/descriptionBuilder'

describe('round spec description', () => {
  it('contains round split summary for R-001 250x3200', async () => {
    await i18n.changeLanguage('ru')
    const text = buildDescription(i18n.t.bind(i18n), 'round-duct', {
      A: 250,
      B: 3200,
      splitCount: 3,
      splitSummary: '2×1250+700',
    })

    expect(text).toContain('2×1250+700')
  })
})
