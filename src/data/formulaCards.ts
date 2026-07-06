export type FormulaRegistryStatus = 'Проверена' | 'Только Sчистовая' | 'Условная' | 'Требует уточнения'
export type FormulaDiscoveryState =
  | 'Проверена'
  | 'Условная'
  | 'Только Sчистовая'
  | 'Источник есть, формула не извлечена'
  | 'Нужен вывод формулы'
  | 'По аналогии'
  | 'По компонентам'
  | 'Нужна сверка с CAMduct'

export interface FormulaRegistryItem {
  code: string
  title: string
  category: string
  cleanArea: string
  fullArea: string
  status: FormulaRegistryStatus
  formulaState: FormulaDiscoveryState
  sourceFound: boolean
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

type FormulaRegistrySeed = Omit<FormulaRegistryItem, 'formulaState' | 'sourceFound' | 'nextAction'> &
  Partial<Pick<FormulaRegistryItem, 'formulaState' | 'sourceFound' | 'nextAction'>>

const extractedMissingArea = 'источник есть, формула не извлечена'
const componentCleanArea = 'по компонентам; требует вывода'
const camductAllowanceArea = 'требует CAMduct-проверки припусков'
const analogyArea = 'по аналогии; требует проверки'
const requiresCheck = 'требует уточнения'
const emptyArea = extractedMissingArea
const sourceDraft = 'Google Sheet / загруженные источники / docs/formula-cards.md'
const nextUse = 'Можно использовать как рабочую формулу.'
const nextCamduct = 'Проверить на тестовом размере в CAMduct.'
const nextExtract = 'Извлечь формулу из загруженного источника или восстановить повреждённый фрагмент.'
const nextDecompose = 'Разложить изделие на компоненты и сверить с CAMduct.'
const nextAnalogy = 'Проверить аналогию с базовым изделием и сверить на тестовом размере.'

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

const analogyFormulaCodes = new Set(['KRG-010', 'KRG-019'])

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
    cleanArea: 'Sчистовая — восстановлена по геометрии Yш/Yз без C1/S1',
    fullArea: 'Sполная = Lразв × (π × Dmin + S1) / 1 000 000',
    status: 'Проверена',
    formulaState: 'Проверена',
    sourceFound: true,
    source: 'Excel-база отвода по данным CAMduct + методичка',
    nextAction: 'Перенести формулу в расчётный engine и покрыть тестами.',
  },
  {
    code: 'KRG-003',
    title: 'Переход круглый центральный',
    category: 'круглые изделия',
    cleanArea: 'Sчистовая = π × (R1 + R2) × l / 1 000 000',
    fullArea: 'Sполная = [π × (R1 + R2) × l + S1 × l + C1 × π × D1 + C2 × π × D2] / 1 000 000 × k',
    status: 'Проверена',
    formulaState: 'Проверена',
    sourceFound: true,
    source: 'Методики переходов круг-в-круг + Excel-базы CAMduct',
    nextAction: 'Перенести формулу в расчётный engine и покрыть тестами.',
  },
  {
    code: 'KRG-004',
    title: 'Переход круглый со смещением / односторонний',
    category: 'круглые изделия',
    cleanArea: 'Sчистовая = π × (R1 + R2) × l / 1 000 000',
    fullArea: 'Sполная = [π × (R1 + R2) × l + S1 × l + C1 × π × D1 + C2 × π × D2] / 1 000 000 × k',
    status: 'Проверена',
    formulaState: 'Проверена',
    sourceFound: true,
    source: 'Методики переходов круг-в-круг + Excel-базы CAMduct',
    nextAction: 'Перенести формулу в расчётный engine и покрыть тестами.',
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
    formulaState: 'Условная',
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
    formulaState: 'Условная',
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

  if (componentFormulaCodes.has(item.code)) {
    return 'По компонентам'
  }

  if (analogyFormulaCodes.has(item.code)) {
    return 'По аналогии'
  }

  if (item.fullArea !== extractedMissingArea || item.cleanArea !== extractedMissingArea) {
    return 'Нужна сверка с CAMduct'
  }

  return 'Источник есть, формула не извлечена'
}

function getNextAction(formulaState: FormulaDiscoveryState) {
  if (formulaState === 'Проверена') {
    return nextUse
  }

  if (formulaState === 'Нужна сверка с CAMduct' || formulaState === 'Условная' || formulaState === 'Только Sчистовая') {
    return nextCamduct
  }

  if (formulaState === 'По компонентам' || formulaState === 'Нужен вывод формулы') {
    return nextDecompose
  }

  if (formulaState === 'По аналогии') {
    return nextAnalogy
  }

  return nextExtract
}

export const formulaRegistry: FormulaRegistryItem[] = formulaRegistrySeed.map((item) => {
  const formulaState = getFormulaState(item)
  const usesComponentModel = formulaState === 'По компонентам' || formulaState === 'Нужен вывод формулы'
  const usesAnalogyModel = formulaState === 'По аналогии'

  return {
    ...item,
    cleanArea: usesComponentModel && item.cleanArea === extractedMissingArea ? componentCleanArea : item.cleanArea,
    fullArea: usesComponentModel && item.fullArea === extractedMissingArea ? camductAllowanceArea : item.fullArea,
    ...(usesAnalogyModel && item.cleanArea === extractedMissingArea ? { cleanArea: analogyArea } : {}),
    ...(usesAnalogyModel && item.fullArea === extractedMissingArea ? { fullArea: analogyArea } : {}),
    formulaState,
    sourceFound: item.sourceFound ?? true,
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
    ...formulaRegistry[1],
    parameters: [
      'D / A — диаметр отвода, мм',
      'C / α — фактический угол производства, °',
      'N / n — количество сегментов',
      'R / RB — внутренний радиус / шейка, мм',
      'L1, L2 — нижнее и верхнее удлинения стаканов, мм',
      'C1 = C1F + C1M — припуск соединителя, мм',
      'S1 = S1FA + S1MA — припуск шва, мм',
    ],
    cleanAreaLines: [
      'Методичка: формула Sчистовая присутствует, но запись повреждена и требует восстановления скобок.',
      'Sчистовая восстановлена по геометрии развёртки Yш/Yз без C1 и S1.',
      'α = (C / (N − 1)) × π / 180',
      'Yш = 2 × R × sin(α / 2) × kш',
      'Yз = 2 × (R + Dmin) × sin(α / 2) × kз',
    ],
    fullAreaLines: [
      'Sполная = Lразв × (π × Dmin + S1) / 1 000 000',
      'Lразв берётся из таблицы угла: L1 + L2 + вклад Yш/Yз по сегментам + (N − 1) × C1',
      'C1 = C1F + C1M',
      'S1 = S1FA + S1MA',
      'В Excel есть листы 90°, 60°, 45°, 30°, 15° с эталонной площадью CAMduct и отклонением.',
    ],
    statusLines: [
      'Проверена — формула восстановлена по Excel-базе, сформированной на основе CAMduct.',
      'Проверена по Excel-базе CAMduct, не является условной.',
    ],
    sourceLines: [
      'Excel-база отвода по данным CAMduct + методичка.',
      'Методичка основная 30.09.2021: раздел “Отводы сегментные круглого сечения (колено круглое)”.',
      'БазаОтвод_90_60_45_30_15_Киев_v2.0.0.xlsx: листы “Отвод 90°”, “Отвод 60°”, “Отвод 45°”, “Отвод 30°”, “Отвод 15°”.',
    ],
    notes: [
      'Найдено: описание изделия, D(A), R(B), N, C/α, L1/L2, C1F/C1M, S1FA/S1MA, Yш/Yз и расчётная площадь развёртки.',
      'Формула восстановлена по Excel-базе, сформированной на основе CAMduct. Не является условной.',
      'Осталось: перенести формулу в расчётный engine и покрыть тестами.',
    ],
  },
  {
    ...formulaRegistry[2],
    parameters: [
      'D1, D2 — диаметры, мм',
      'R1 = D1 / 2',
      'R2 = D2 / 2',
      'L — табличная длина переходной части, мм',
      'e = 0',
      'S1 = S1FA + S1MA',
      'C1, C2 — припуски по окружности D1/D2',
      'k = 1.0065',
    ],
    cleanAreaLines: ['l = √((R2 − R1)² + L²)', 'Sчистовая = π × (R1 + R2) × l / 1 000 000'],
    fullAreaLines: [
      'S = π × (R1 + R2) × l + S1 × l + C1 × π × D1 + C2 × π × D2',
      'Sитог = S / 1 000 000 × k',
      'Для KRG-003: e = 0, k = 1.0065.',
    ],
    statusLines: ['Проверена — подтверждена методиками переходов круг-в-круг и Excel-базами CAMduct.'],
    sourceLines: ['Методики переходов круг-в-круг + Excel-базы CAMduct'],
    notes: ['Следующее действие: перенести формулу в расчётный engine и покрыть тестами.'],
  },
  {
    ...formulaRegistry[3],
    parameters: [
      'D1, D2 — диаметры, мм',
      'R1 = D1 / 2',
      'R2 = D2 / 2',
      'L — табличная длина переходной части, мм',
      'e — смещение осей, мм',
      'S1 = S1FA + S1MA',
      'C1, C2 — припуски по окружности D1/D2',
      'k = 1.00311',
    ],
    cleanAreaLines: ['l = √((R2 − R1)² + L² + e²)', 'Sчистовая = π × (R1 + R2) × l / 1 000 000'],
    fullAreaLines: [
      'S = π × (R1 + R2) × l + S1 × l + C1 × π × D1 + C2 × π × D2',
      'Sитог = S / 1 000 000 × k',
      'Односторонний переход: e = (D1 − D2) / 2.',
      'Переход со смещением: e = ручной ввод.',
      'Для KRG-004: k = 1.00311.',
    ],
    statusLines: ['Проверена — подтверждена методиками переходов круг-в-круг и Excel-базами CAMduct.'],
    sourceLines: ['Методики переходов круг-в-круг + Excel-базы CAMduct'],
    notes: ['Следующее действие: перенести формулу в расчётный engine и покрыть тестами.'],
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
