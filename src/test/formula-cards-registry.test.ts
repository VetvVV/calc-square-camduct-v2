import { describe, expect, it } from 'vitest'
import { formulaDetailCards, formulaRegistry } from '../data/formulaCards'

const expectedCodes = [
  ...Array.from({ length: 19 }, (_, index) => `KRG-${String(index + 1).padStart(3, '0')}`),
  ...Array.from({ length: 13 }, (_, index) => `PRM-${String(index + 1).padStart(3, '0')}`),
  ...Array.from({ length: 7 }, (_, index) => `KMB-${String(index + 1).padStart(3, '0')}`),
]

const allowedStatuses = new Set(['Проверена', 'Только Sчистовая', 'Условная', 'Требует уточнения'])
const allowedFormulaStates = new Set([
  'Проверена',
  'Условная',
  'Только Sчистовая',
  'Источник есть, формула не извлечена',
  'Нужен вывод формулы',
  'По аналогии',
  'По аналогии с KRG-005',
  'По компонентам',
  'Нужна сверка с CAMduct',
])

const detailByCode = new Map(formulaDetailCards.map((card) => [card.code, card]))

function detailText(code: string) {
  const card = detailByCode.get(code)
  if (!card) return ''

  return [
    card.code,
    card.title,
    card.category,
    card.cleanArea,
    card.fullArea,
    card.status,
    card.formulaState,
    card.source,
    card.nextAction,
    ...card.parameters,
    ...card.cleanAreaLines,
    ...card.fullAreaLines,
    ...card.statusLines,
    ...card.sourceLines,
    ...(card.notes ?? []),
    ...(card.alternativeFormulas ?? []).flatMap((item) => [item.source, item.formula, item.note]),
  ].join('\n')
}

describe('formula registry integrity', () => {
  it('keeps the expected catalogue size, order, and unique codes', () => {
    const actualCodes = formulaRegistry.map((item) => item.code)

    expect(actualCodes).toEqual(expectedCodes)
    expect(formulaRegistry).toHaveLength(39)
    expect(new Set(actualCodes).size).toBe(actualCodes.length)
  })

  it('has a detail card for every registry item', () => {
    expect(formulaDetailCards).toHaveLength(formulaRegistry.length)

    for (const code of expectedCodes) {
      expect(detailByCode.has(code)).toBe(true)
    }
  })

  it('uses only supported statuses and formula states', () => {
    for (const item of formulaRegistry) {
      expect(allowedStatuses.has(item.status), `${item.code} has unsupported status ${item.status}`).toBe(true)
      expect(allowedFormulaStates.has(item.formulaState), `${item.code} has unsupported formulaState ${item.formulaState}`).toBe(true)
    }
  })

  it('does not let SPVA alternatives make a card checked by themselves', () => {
    for (const card of formulaDetailCards) {
      if (card.status === 'Проверена') {
        expect(card.source).not.toContain('СПВА')
      }
    }
  })

  it('keeps the KMB cards separated by engineering meaning', () => {
    expect(detailByCode.get('KMB-001')?.title).toContain('прямоугольник → круг')
    expect(detailText('KMB-001')).toContain('прямоугольного входа')
    expect(detailText('KMB-001')).toContain('круглому выходу')

    expect(detailText('KMB-003')).toContain('круглый ствол')
    expect(detailText('KMB-003')).toContain('прямоугольную ветку')

    expect(detailText('KMB-004')).toContain('прямоугольный ствол')
    expect(detailText('KMB-004')).toContain('круглую ветку')

    expect(detailByCode.get('KMB-005')?.status).not.toBe('Проверена')
    expect(detailText('KMB-005').toLowerCase()).toContain('kmb-005 не должен автоматически считаться простым krg-001')

    expect(detailByCode.get('KMB-006')?.status).not.toBe('Проверена')
    expect(detailText('KMB-006')).toContain('Не считать KMB-006 простым PRM-001')

    expect(detailByCode.get('KMB-007')?.formulaState).toBe('По компонентам')
    expect(detailText('KMB-007')).toContain('По компонентам')
    expect(detailText('KMB-007')).toContain('листовой площади')
  })
})
