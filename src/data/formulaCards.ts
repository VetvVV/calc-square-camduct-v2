export type FormulaRegistryStatus = 'Проверена' | 'Только Sчистовая' | 'Условная' | 'Требует уточнения'
export type FormulaDiscoveryState =
  | 'Проверена'
  | 'Условная'
  | 'Только Sчистовая'
  | 'Не найдена в источниках'
  | 'Нужен вывод формулы'
  | 'Нужна сверка с CAMduct'

export interface FormulaRegistryItem {
  code: string
  title: string
  category: string
  cleanArea: string
  fullArea: string
  status: FormulaRegistryStatus
  formulaState: FormulaDiscoveryState
  source: string
  nextAction: string
}

export interface FormulaDetailCard extends FormulaRegistryItem {
  parameters: string[]
  cleanAreaLines: string[]
  fullAreaLines: string[]
  statusLines: string[]
  sourceLines: string[]
  notes?: string[]
}

type FormulaRegistrySeed = Omit<FormulaRegistryItem, 'formulaState' | 'nextAction'> &
  Partial<Pick<FormulaRegistryItem, 'formulaState' | 'nextAction'>>

const notFoundArea = 'не найдена в источниках'
const componentCleanArea = 'по компонентам; требует вывода'
const camductAllowanceArea = 'требует CAMduct-проверки припусков'
const requiresCheck = 'требует уточнения'
const emptyArea = notFoundArea
const sourceDraft = 'Черновой реестр docs/formula-cards.md'
const nextUse = 'Можно использовать как рабочую формулу.'
const nextCamduct = 'Проверить на тестовом размере в CAMduct.'
const nextFindOrDerive = 'Найти формулу в методичке / старом калькуляторе или вывести по геометрии.'
const nextDecompose = 'Разложить изделие на компоненты и сверить с CAMduct.'

const componentFormulaCodes = new Set([
  'KRG-005',
  'KRG-008',
  'KRG-015',
  'PRM-004',
  'PRM-005',
  'PRM-006',
  'PRM-009',
  'KMB-001',
  'KMB-002',
  'KMB-003',
  'KMB-005',
  'KMB-006',
  'KMB-007',
])

const formulaRegistrySeed: FormulaRegistrySeed[] = [
  {
    code: 'KRG-001',
    title: 'Воздуховод круглый / труба прямошовная',
    category: 'круглые изделия',
    cleanArea: 'Sчистовая = π × D × L / 1 000 000',
    fullArea: 'Sполная = (π × D + S1) × L / 1 000 000',
    status: 'Проверена',
    source: 'AGENTS.md / проектная логика R-001 / правило S1 / подтверждение владельца',
  },
  {
    code: 'KRG-002',
    title: 'Отвод круглый',
    category: 'круглые изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
  {
    code: 'KRG-003',
    title: 'Переход круглый центральный',
    category: 'круглые изделия',
    cleanArea: 'Sчистовая = π × (R1 + R2) × l / 1 000 000',
    fullArea: 'Sполная = [π × (R1 + R2) × l + S1 × l + C1 × π × D1 + C2 × π × D2] / 1 000 000 × k',
    status: 'Условная',
    source: 'Методички переходов круг-в-круг / CAMduct-базы Киев',
  },
  {
    code: 'KRG-004',
    title: 'Переход круглый со смещением / односторонний',
    category: 'круглые изделия',
    cleanArea: emptyArea,
    fullArea: 'Sполная = [π × (R1 + R2) × l + S1 × l + C1 × π × D1 + C2 × π × D2] / 1 000 000 × k',
    status: 'Условная',
    source: 'Методички переходов круг-в-круг / CAMduct-базы Киев',
  },
  {
    code: 'KRG-005',
    title: 'Тройник круглый',
    category: 'круглые изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
  {
    code: 'KRG-006',
    title: 'Тройник нестандартный круглый',
    category: 'круглые изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
  {
    code: 'KRG-007',
    title: 'Заглушка круглая',
    category: 'круглые изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
  {
    code: 'KRG-008',
    title: 'Врезка круглая',
    category: 'круглые изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
  {
    code: 'KRG-009',
    title: 'Седло',
    category: 'круглые изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
  {
    code: 'KRG-010',
    title: 'Ниппель круглый',
    category: 'круглые изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Условная',
    source: sourceDraft,
  },
  {
    code: 'KRG-011',
    title: 'Шумоглушитель круглый',
    category: 'круглые изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
  {
    code: 'KRG-012',
    title: 'Зонт круглый',
    category: 'круглые изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
  {
    code: 'KRG-013',
    title: 'Дроссель круглый',
    category: 'круглые изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
  {
    code: 'KRG-014',
    title: 'Фланец круглый',
    category: 'круглые изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
  {
    code: 'KRG-015',
    title: 'Крестовина круглая',
    category: 'круглые изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
  {
    code: 'KRG-016',
    title: 'Утка круглая',
    category: 'круглые изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
  {
    code: 'KRG-017',
    title: 'Обратный клапан круглый',
    category: 'круглые изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
  {
    code: 'KRG-018',
    title: 'Дефлектор',
    category: 'круглые изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
  {
    code: 'KRG-019',
    title: 'Муфта',
    category: 'круглые изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Условная',
    source: sourceDraft,
  },
  {
    code: 'PRM-001',
    title: 'Воздуховод прямоугольный',
    category: 'прямоугольные изделия',
    cleanArea: 'Sчистовая = 2 × (W + H) × L / 1 000 000',
    fullArea: 'Sполная = P × L / 1 000 000',
    status: 'Проверена',
    source: 'Старый калькулятор прямоугольных воздуховодов',
  },
  {
    code: 'PRM-002',
    title: 'Отвод прямоугольный',
    category: 'прямоугольные изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
  {
    code: 'PRM-003',
    title: 'Колено прямоугольное переходное',
    category: 'прямоугольные изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
  {
    code: 'PRM-004',
    title: 'Переход прямоугольный',
    category: 'прямоугольные изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
  {
    code: 'PRM-005',
    title: 'Тройник прямоугольный',
    category: 'прямоугольные изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
  {
    code: 'PRM-006',
    title: 'Крестовина прямоугольная',
    category: 'прямоугольные изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
  {
    code: 'PRM-007',
    title: 'Утка прямоугольная',
    category: 'прямоугольные изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
  {
    code: 'PRM-008',
    title: 'Заглушка прямоугольная',
    category: 'прямоугольные изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
  {
    code: 'PRM-009',
    title: 'Врезка прямоугольная',
    category: 'прямоугольные изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
  {
    code: 'PRM-010',
    title: 'Прямоугольный воздуховод с прямоугольной врезкой',
    category: 'прямоугольные изделия',
    cleanArea: emptyArea,
    fullArea: 'Sполная = Sосн − ΣSотв + ΣSврезки',
    status: 'Условная',
    source: 'Старый калькулятор воздуховода с прямоугольными врезками CAMduct v4.2',
  },
  {
    code: 'PRM-011',
    title: 'Шумоглушитель прямоугольный',
    category: 'прямоугольные изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
  {
    code: 'PRM-012',
    title: 'Зонт прямоугольный',
    category: 'прямоугольные изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
  {
    code: 'PRM-013',
    title: 'Дроссель прямой',
    category: 'прямоугольные изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
  {
    code: 'KMB-001',
    title: 'Переход круг-прямоугольник',
    category: 'комбинированные изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
  {
    code: 'KMB-002',
    title: 'Седло с прямоугольной врезкой',
    category: 'комбинированные изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
  {
    code: 'KMB-003',
    title: 'Тройник круг-прямоугольник',
    category: 'комбинированные изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
  {
    code: 'KMB-004',
    title: 'Тройник прямоугольник-круг / прямоугольный воздуховод с круглой врезкой',
    category: 'комбинированные изделия',
    cleanArea: emptyArea,
    fullArea: 'Sполная = Sосн − ΣSотв + ΣSврезки',
    status: 'Условная',
    source: 'Старый калькулятор круглой врезки CAMduct v4.8',
  },
  {
    code: 'KMB-005',
    title: 'Адаптер круглый',
    category: 'комбинированные изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
  {
    code: 'KMB-006',
    title: 'Адаптер прямоугольный',
    category: 'комбинированные изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
  {
    code: 'KMB-007',
    title: 'Жироуловитель',
    category: 'комбинированные изделия',
    cleanArea: emptyArea,
    fullArea: emptyArea,
    status: 'Требует уточнения',
    source: sourceDraft,
  },
]

function getFormulaState(item: FormulaRegistrySeed): FormulaDiscoveryState {
  if (item.formulaState) {
    return item.formulaState
  }

  if (item.status === 'Проверена') {
    return 'Проверена'
  }

  if (item.status === 'Только Sчистовая') {
    return 'Только Sчистовая'
  }

  if (item.fullArea !== notFoundArea || item.cleanArea !== notFoundArea) {
    return 'Нужна сверка с CAMduct'
  }

  if (componentFormulaCodes.has(item.code)) {
    return 'Нужен вывод формулы'
  }

  return 'Не найдена в источниках'
}

function getNextAction(formulaState: FormulaDiscoveryState) {
  if (formulaState === 'Проверена') {
    return nextUse
  }

  if (formulaState === 'Нужна сверка с CAMduct' || formulaState === 'Условная' || formulaState === 'Только Sчистовая') {
    return nextCamduct
  }

  if (formulaState === 'Нужен вывод формулы') {
    return nextDecompose
  }

  return nextFindOrDerive
}

export const formulaRegistry: FormulaRegistryItem[] = formulaRegistrySeed.map((item) => {
  const formulaState = getFormulaState(item)
  const usesComponentModel = formulaState === 'Нужен вывод формулы'

  return {
    ...item,
    cleanArea: usesComponentModel && item.cleanArea === notFoundArea ? componentCleanArea : item.cleanArea,
    fullArea: usesComponentModel && item.fullArea === notFoundArea ? camductAllowanceArea : item.fullArea,
    formulaState,
    nextAction: item.nextAction ?? getNextAction(formulaState),
  }
})

const formulaKnownDetailCards: FormulaDetailCard[] = [
  {
    ...formulaRegistry[0],
    parameters: ['D — диаметр, мм', 'L — длина, мм', 't — толщина металла, мм'],
    cleanAreaLines: ['Sчистовая = π × D × L / 1 000 000'],
    fullAreaLines: [
      'Sполная = (π × D + S1) × L / 1 000 000',
      'S1 = S1FA + S1MA',
      't = 0.5 или 0.7 мм → S1 = 12.5 + 12.5 = 25 мм',
      't = 0.9 мм → S1 = 14 + 14 = 28 мм',
    ],
    statusLines: ['Sчистовая — подтверждена', 'Sполная — подтверждена по текущей логике S1'],
    sourceLines: ['AGENTS.md / проектная логика R-001 / правило S1 / подтверждение владельца'],
  },
  {
    ...formulaRegistry[2],
    parameters: ['D1, D2 — диаметры, мм', 'L — табличная длина, мм', 'S1, C1, C2 — припуски', 'k = 1.0065'],
    cleanAreaLines: ['l = √((R2 − R1)² + L²)', 'Sчистовая = π × (R1 + R2) × l / 1 000 000'],
    fullAreaLines: ['Sполная = [π × (R1 + R2) × l + S1 × l + C1 × π × D1 + C2 × π × D2] / 1 000 000 × k'],
    statusLines: ['Sполная — подтверждена методикой, требует сверки табличной длины L и припусков по базе'],
    sourceLines: ['Методички переходов круг-в-круг / CAMduct-базы Киев'],
  },
  {
    ...formulaRegistry[3],
    parameters: ['D1, D2 — диаметры, мм', 'L — табличная длина, мм', 'e — смещение осей, мм', 'S1, C1, C2 — припуски', 'k = 1.00311'],
    cleanAreaLines: [requiresCheck],
    fullAreaLines: ['l = √((R2 − R1)² + L² + e²)', 'Sполная = [π × (R1 + R2) × l + S1 × l + C1 × π × D1 + C2 × π × D2] / 1 000 000 × k'],
    statusLines: ['Sполная — подтверждена методикой, требует сверки табличной длины L и припусков по базе'],
    sourceLines: ['Методички переходов круг-в-круг / CAMduct-базы Киев'],
  },
  {
    ...formulaRegistry[19],
    parameters: ['W — ширина, мм', 'H — высота, мм', 'L — длина, мм', 't — толщина металла, мм'],
    cleanAreaLines: ['Sчистовая = 2 × (W + H) × L / 1 000 000'],
    fullAreaLines: ['Sполная = P × L / 1 000 000', 'P = 2 × (W + Z1) + 2 × (H + Z2)'],
    statusLines: ['Sчистовая — подтверждена', 'Sполная — подтверждена старым калькулятором, требует сверки с CAMduct по обозначениям замка'],
    sourceLines: ['Старый калькулятор прямоугольных воздуховодов'],
  },
  {
    ...formulaRegistry[28],
    parameters: ['A, B, L — основной воздуховод, мм', 'a, b — отверстие / врезка, мм', 'Hв — высота врезки, мм', 'Zconn — припуск', 'N — количество замков'],
    cleanAreaLines: [requiresCheck],
    fullAreaLines: ['Sосн = 2 × (A + B) × L / 1 000 000', 'Sотв = a × b / 1 000 000', 'Sврезки = (Pврезки + 15 × N) × (Hв + Zconn) / 1 000 000', 'Sполная = Sосн − ΣSотв + ΣSврезки'],
    statusLines: ['Sполная — подтверждена старым калькулятором, требует сверки с CAMduct'],
    sourceLines: ['Старый калькулятор воздуховода с прямоугольными врезками CAMduct v4.2'],
  },
  {
    ...formulaRegistry[35],
    parameters: ['A, B, L — основной прямоугольный воздуховод, мм', 'Dв — диаметр круглой врезки, мм', 'Hв — высота врезки, мм', 'Zconn — припуск'],
    cleanAreaLines: [requiresCheck],
    fullAreaLines: ['Sосн = 2 × (Aadj + Badj) × Ladj / 1 000 000', 'Sотв = π × Dв² / 4 / 1 000 000', 'Sврезки = (π × Dв + 8) × (Hв + Zconn) / 1 000 000', 'Sполная = Sосн − ΣSотв + ΣSврезки'],
    statusLines: ['Sполная — подтверждена старым калькулятором, требует сверки с CAMduct'],
    sourceLines: ['Старый калькулятор круглой врезки CAMduct v4.8'],
  },
]

const knownDetailByCode = new Map(formulaKnownDetailCards.map((card) => [card.code, card]))

export const formulaDetailCards: FormulaDetailCard[] = formulaRegistry.map((item) => {
  const knownDetail = knownDetailByCode.get(item.code)

  if (knownDetail) {
    return knownDetail
  }

  return {
    ...item,
    parameters: [requiresCheck],
    cleanAreaLines: [item.cleanArea],
    fullAreaLines: [item.fullArea],
    statusLines: [item.status],
    sourceLines: [item.source],
  }
})
