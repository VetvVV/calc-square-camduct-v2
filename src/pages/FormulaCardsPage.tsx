import { useAppStore } from '../store/appStore'
import { canViewFormulaDetails } from '../roles/permissions'

interface FormulaCard {
  code: string
  title: string
  category: string
  parameters: string[]
  cleanArea: string[]
  fullArea: string[]
  example: string[]
  status: string[]
  source: string[]
}

const formulaCards: FormulaCard[] = [
  {
    code: 'KRG-001',
    title: 'Воздуховод круглый / труба прямошовная',
    category: 'круглые изделия',
    parameters: [
      'D — диаметр, мм',
      'L — длина, мм',
      't — толщина металла, мм',
    ],
    cleanArea: ['Sчистовая = π × D × L / 1 000 000'],
    fullArea: [
      'Sполная = (π × D + S1) × L / 1 000 000',
      'S1 = S1FA + S1MA',
      't = 0.5 или 0.7 мм → S1 = 12.5 + 12.5 = 25 мм',
      't = 0.9 мм → S1 = 14 + 14 = 28 мм',
      'Не округлять 12.5 до 12 при расчёте полной площади развёртки.',
    ],
    example: [
      'D = 250 мм; L = 1000 мм; t = 0.5 мм; S1 = 25 мм',
      'Sчистовая = 0.785 м²',
      'Sполная = 0.810 м²',
    ],
    status: [
      'Sчистовая — подтверждена',
      'Sполная — подтверждена по текущей логике S1',
    ],
    source: ['AGENTS.md / проектная логика R-001 / правило S1 / подтверждение владельца'],
  },
  {
    code: 'PRM-001',
    title: 'Воздуховод прямоугольный',
    category: 'прямоугольные изделия',
    parameters: [
      'W — ширина, мм',
      'H — высота, мм',
      'L — длина, мм',
      't — толщина металла, мм',
      'Старые обозначения: A → W, B → H, L → L',
    ],
    cleanArea: ['Sчистовая = 2 × (W + H) × L / 1 000 000'],
    fullArea: [
      'Sполная = P × L / 1 000 000',
      'P = 2 × (W + Z1) + 2 × (H + Z2)',
      'если L ≤ 200 мм → Z1 = 0, Z2 = 15',
      'если t ≤ 0.9 мм → Z1 = 6, Z2 = 30',
      'если t > 0.9 мм → Z1 = 5, Z2 = 27',
    ],
    example: [
      'W = 300 мм; H = 200 мм; L = 1000 мм; t = 0.7 мм',
      'Z1 = 6 мм; Z2 = 30 мм',
      'Sчистовая = 1.000 м²',
      'Sполная = 1.072 м²',
    ],
    status: [
      'Sчистовая — подтверждена',
      'Sполная — подтверждена старым калькулятором, требует сверки с CAMduct по обозначениям замка',
    ],
    source: ['Старый калькулятор прямоугольных воздуховодов'],
  },
  {
    code: 'PRM-010',
    title: 'Прямоугольный воздуховод с прямоугольной врезкой',
    category: 'прямоугольные изделия',
    parameters: [
      'A — ширина основного воздуховода, мм',
      'B — высота основного воздуховода, мм',
      'L — длина основного воздуховода, мм',
      'a — ширина отверстия / врезки, мм',
      'b — длина отверстия по оси L, мм',
      'Hв — высота врезки, мм',
      'Zconn — припуск на присоединение, мм',
      'N — количество замков',
    ],
    cleanArea: ['Sчистовая — не выделена отдельно в карточке источника'],
    fullArea: [
      'Sосн = 2 × (A + B) × L / 1 000 000',
      'Sотв = a × b / 1 000 000',
      'Pврезки = 2 × (a + Hв)',
      'Sврезки = (Pврезки + 15 × N) × (Hв + Zconn) / 1 000 000',
      'Sполная = Sосн − ΣSотв + ΣSврезки',
      'Если Hв = 0, то Sврезки = 0',
    ],
    example: ['Отдельный числовой пример в docs/formula-cards.md не указан'],
    status: ['Sполная — подтверждена старым калькулятором, требует сверки с CAMduct'],
    source: ['Старый калькулятор воздуховода с прямоугольными врезками CAMduct v4.2'],
  },
  {
    code: 'KMB-004',
    title: 'Тройник прямоугольник-круг / прямоугольный воздуховод с круглой врезкой',
    category: 'комбинированные изделия',
    parameters: [
      'A — ширина основного прямоугольного воздуховода, мм',
      'B — высота основного прямоугольного воздуховода, мм',
      'L — длина основного воздуховода, мм',
      'Dв — диаметр круглой врезки, мм',
      'Hв — высота врезки, мм',
      'Zconn — припуск на присоединение, мм',
    ],
    cleanArea: ['Sчистовая — не выделена отдельно в карточке источника'],
    fullArea: [
      'Sосн = 2 × (Aadj + Badj) × Ladj / 1 000 000',
      'Sотв = π × Dв² / 4 / 1 000 000',
      'Sврезки = (π × Dв + 8) × (Hв + Zconn) / 1 000 000',
      'Sполная = Sосн − ΣSотв + ΣSврезки',
      't = 0.5 или 0.7 мм → C1FA = 30, C1MA = 6',
      't = 0.9 мм → C1FA = 28, C1MA = 5',
      'Aadj = A + C1MA / 2; Badj = B + C1FA / 2; Ladj = L + C1FA + C1MA',
    ],
    example: ['Отдельный числовой пример в docs/formula-cards.md не указан'],
    status: ['Sполная — подтверждена старым калькулятором, требует сверки с CAMduct'],
    source: ['Старый калькулятор круглой врезки CAMduct v4.8'],
  },
  {
    code: 'KRG-003',
    title: 'Переход круглый центральный',
    category: 'круглые изделия',
    parameters: [
      'D1 — больший диаметр, мм',
      'D2 — меньший диаметр, мм',
      'R1 = D1 / 2',
      'R2 = D2 / 2',
      'L — табличная длина переходной части, мм',
      'S1 — припуск по образующей, мм',
      'C1 — припуск по окружности D1, мм',
      'C2 — припуск по окружности D2, мм',
      'k — поправочный коэффициент',
    ],
    cleanArea: [
      'l = √((R2 − R1)² + L²)',
      'Sчистовая = π × (R1 + R2) × l / 1 000 000',
    ],
    fullArea: [
      'Sполная = [π × (R1 + R2) × l + S1 × l + C1 × π × D1 + C2 × π × D2] / 1 000 000 × k',
      'Для центрального перехода: e = 0; k = 1.0065',
    ],
    example: ['Отдельный числовой пример в docs/formula-cards.md не указан'],
    status: ['Sполная — подтверждена методикой, требует сверки табличной длины L и припусков по базе'],
    source: ['Методички переходов круг-в-круг / CAMduct-базы Киев'],
  },
  {
    code: 'KRG-004',
    title: 'Переход круглый со смещением / односторонний',
    category: 'круглые изделия',
    parameters: [
      'D1 — больший диаметр, мм',
      'D2 — меньший диаметр, мм',
      'R1 = D1 / 2',
      'R2 = D2 / 2',
      'L — табличная длина переходной части, мм',
      'e — смещение осей, мм',
      'S1 — припуск по образующей, мм',
      'C1 — припуск по окружности D1, мм',
      'C2 — припуск по окружности D2, мм',
      'k — поправочный коэффициент',
    ],
    cleanArea: ['Sчистовая — не выделена отдельно в карточке источника'],
    fullArea: [
      'l = √((R2 − R1)² + L² + e²)',
      'Sполная = [π × (R1 + R2) × l + S1 × l + C1 × π × D1 + C2 × π × D2] / 1 000 000 × k',
      'Для одностороннего перехода: e = (D1 − D2) / 2; k = 1.00311',
      'Для перехода со смещением: e = ручной ввод; k = 1.00311',
    ],
    example: ['Отдельный числовой пример в docs/formula-cards.md не указан'],
    status: ['Sполная — подтверждена методикой, требует сверки табличной длины L и припусков по базе'],
    source: ['Методички переходов круг-в-круг / CAMduct-базы Киев'],
  },
]

function FormulaList({ title, lines }: { title: string; lines: string[] }) {
  return (
    <section>
      <h3>{title}</h3>
      <ul>
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </section>
  )
}

export function FormulaCardsPage() {
  const role = useAppStore((state) => state.role)
  const canView = canViewFormulaDetails(role)

  if (!canView) {
    return (
      <section className="formula-cards-page-v1">
        <div className="formula-cards-denied-v1" role="status">
          Этот раздел доступен только для административного или сервисного режима.
        </div>
      </section>
    )
  }

  return (
    <section className="formula-cards-page-v1" aria-labelledby="formula-cards-title">
      <header className="formula-cards-head-v1">
        <p>Инженерная справка</p>
        <h1 id="formula-cards-title">Формулы / инженерная справка</h1>
        <span>Главный показатель для расхода материала — Sполная. Масса и количество здесь не считаются.</span>
      </header>

      <div className="formula-cards-grid-v1">
        {formulaCards.map((card) => (
          <article className="formula-card-v1" key={card.code}>
            <header>
              <span>{card.code}</span>
              <h2>{card.title}</h2>
              <p>{card.category}</p>
            </header>

            <FormulaList title="Параметры" lines={card.parameters} />
            <FormulaList title="Sчистовая" lines={card.cleanArea} />
            <FormulaList title="Sполная" lines={card.fullArea} />
            <FormulaList title="Пример" lines={card.example} />
            <FormulaList title="Статус" lines={card.status} />
            <FormulaList title="Источник" lines={card.source} />
          </article>
        ))}
      </div>
    </section>
  )
}
