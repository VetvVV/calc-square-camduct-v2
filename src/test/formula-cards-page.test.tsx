import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { NavBar } from '../components/Layout/NavBar'
import { formulaRegistry } from '../data/formulaCards'
import i18n from '../i18n'
import { FormulaCardsPage } from '../pages/FormulaCardsPage'
import { useAppStore } from '../store/appStore'

describe('formula cards page', () => {
  afterEach(() => {
    cleanup()
  })

  it('blocks formula cards for public roles', () => {
    useAppStore.setState({ role: 'guest' })

    render(<FormulaCardsPage />)

    expect(screen.getByText('Этот раздел доступен только для административного или сервисного режима.')).toBeInTheDocument()
    expect(screen.queryByText('KRG-001')).not.toBeInTheDocument()
  })

  it('renders the full formula registry and one selected card for service mode', () => {
    useAppStore.setState({ role: 'service' })

    render(<FormulaCardsPage />)

    expect(screen.getByRole('heading', { name: 'Формулы / инженерная справка' })).toBeInTheDocument()
    expect(screen.getByText('Главный показатель для расхода материала — Sполная. Масса и количество здесь не считаются.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Контрольный реестр каталога' })).toBeInTheDocument()
    expect(screen.getByText('Нажмите на строку изделия, чтобы открыть карточку формулы ниже.')).toBeInTheDocument()
    expect(screen.getByText(`${formulaRegistry.length} изделий`)).toBeInTheDocument()

    for (const code of ['KRG-001', 'KRG-019', 'PRM-001', 'PRM-013', 'KMB-001', 'KMB-007']) {
      expect(screen.getAllByText(code).length).toBeGreaterThan(0)
    }

    for (const code of ['PRM-010', 'KMB-004', 'KRG-003', 'KRG-004']) {
      expect(screen.getAllByText(code).length).toBeGreaterThan(0)
    }

    expect(screen.getAllByText('Требует уточнения').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Условная').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Проверена').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Состояние формулы').length).toBeGreaterThan(0)
    expect(screen.queryByText('Не найдена в источниках')).not.toBeInTheDocument()
    expect(screen.getAllByText('Источник есть, формула не извлечена').length).toBeGreaterThan(0)
    expect(screen.getAllByText('По компонентам').length).toBeGreaterThan(0)
    expect(screen.getAllByText('По аналогии').length).toBeGreaterThan(0)

    const details = screen.getByRole('heading', { name: 'Карточка выбранного изделия' }).closest('section')
    expect(details).not.toBeNull()
    expect(within(details!).getAllByText('KRG-001').length).toBeGreaterThan(0)
    expect(within(details!).queryByText('KMB-004')).not.toBeInTheDocument()

    const targetRow = screen.getByText('KMB-007').closest('tr')
    expect(targetRow).not.toBeNull()
    fireEvent.click(targetRow!)

    expect(targetRow).toHaveAttribute('aria-selected', 'true')
    expect(within(details!).getAllByText('KMB-007').length).toBeGreaterThan(0)
    expect(within(details!).getByText('Жироуловитель')).toBeInTheDocument()
    expect(within(details!).getByText('по компонентам; требует вывода')).toBeInTheDocument()
    expect(within(details!).getByText('требует CAMduct-проверки припусков')).toBeInTheDocument()
    expect(within(details!).getByText('По компонентам')).toBeInTheDocument()
    expect(within(details!).getByText('Источник найден')).toBeInTheDocument()
    expect(within(details!).getByText('да')).toBeInTheDocument()
    expect(within(details!).getByText('Разложить изделие на компоненты и сверить с CAMduct.')).toBeInTheDocument()

    const elbowRow = screen.getByText('KRG-002').closest('tr')
    expect(elbowRow).not.toBeNull()
    fireEvent.click(elbowRow!)

    expect(elbowRow).toHaveAttribute('aria-selected', 'true')
    expect(within(details!).getAllByText('KRG-002').length).toBeGreaterThan(0)
    expect(within(details!).getByText('Отвод круглый')).toBeInTheDocument()
    expect(within(details!).getAllByText('Проверена').length).toBeGreaterThan(0)
    expect(within(details!).getByText('Excel-база отвода по данным CAMduct + методичка.')).toBeInTheDocument()
    expect(within(details!).getByText('Методичка основная 30.09.2021: раздел “Отводы сегментные круглого сечения (колено круглое)”.')).toBeInTheDocument()
    expect(within(details!).getByText('Формула восстановлена по Excel-базе, сформированной на основе CAMduct. Не является условной.')).toBeInTheDocument()
    expect(within(details!).getByText('Перенести формулу в расчётный engine и покрыть тестами.')).toBeInTheDocument()

    const centeredTransitionRow = screen.getByText('KRG-003').closest('tr')
    expect(centeredTransitionRow).not.toBeNull()
    fireEvent.click(centeredTransitionRow!)

    expect(centeredTransitionRow).toHaveAttribute('aria-selected', 'true')
    expect(within(details!).getByText('Переход круглый центральный')).toBeInTheDocument()
    expect(within(details!).getAllByText('Проверена').length).toBeGreaterThan(0)
    expect(within(details!).getByText('Методики переходов круг-в-круг + Excel-базы CAMduct')).toBeInTheDocument()
    expect(within(details!).getByText('Для KRG-003: e = 0, k = 1.0065.')).toBeInTheDocument()

    const offsetTransitionRow = screen.getByText('KRG-004').closest('tr')
    expect(offsetTransitionRow).not.toBeNull()
    fireEvent.click(offsetTransitionRow!)

    expect(offsetTransitionRow).toHaveAttribute('aria-selected', 'true')
    expect(within(details!).getByText('Переход круглый со смещением / односторонний')).toBeInTheDocument()
    expect(within(details!).getAllByText('Проверена').length).toBeGreaterThan(0)
    expect(within(details!).getByText('Методики переходов круг-в-круг + Excel-базы CAMduct')).toBeInTheDocument()
    expect(within(details!).getByText('Односторонний переход: e = (D1 − D2) / 2.')).toBeInTheDocument()
    expect(within(details!).getByText('Переход со смещением: e = ручной ввод.')).toBeInTheDocument()

    const teeRow = screen.getByText('KRG-005').closest('tr')
    expect(teeRow).not.toBeNull()
    fireEvent.click(teeRow!)

    expect(teeRow).toHaveAttribute('aria-selected', 'true')
    expect(within(details!).getByText('Тройник круглый')).toBeInTheDocument()
    expect(within(details!).getAllByText('Проверена').length).toBeGreaterThan(0)
    expect(within(details!).getByText('Excel-база тройника круглого по данным CAMduct + методичка.')).toBeInTheDocument()
    expect(within(details!).getByText('Sчистовая = Sствол − Sотверстие_ствол + Sврезка_седловая')).toBeInTheDocument()
    expect(within(details!).getByText('Sотверстие_ствол — площадь участка поверхности ствола, попадающего в пересечение с цилиндром врезки.')).toBeInTheDocument()
    expect(within(details!).getByText('Sврезка_седловая — площадь врезки по переменной длине седловой линии.')).toBeInTheDocument()
    expect(within(details!).getByText('Формула восстановлена по Excel-базе, сформированной на основе CAMduct. Не является условной.')).toBeInTheDocument()
    expect(within(details!).getByText('Следующее действие: при внедрении в engine реализовать расчёт пересечения двух цилиндров и покрыть тестами по Excel-базе CAMduct.')).toBeInTheDocument()

    const customTeeRow = screen.getByText('KRG-006').closest('tr')
    expect(customTeeRow).not.toBeNull()
    fireEvent.click(customTeeRow!)

    expect(customTeeRow).toHaveAttribute('aria-selected', 'true')
    expect(within(details!).getByText('Тройник нестандартный круглый')).toBeInTheDocument()
    expect(within(details!).getByText('По аналогии с KRG-005')).toBeInTheDocument()
    expect(within(details!).getByText('KRG-005 + методичка тройника круглого + Excel-база CAMduct.')).toBeInTheDocument()
    expect(within(details!).getByText('Sствол = π × D × L1')).toBeInTheDocument()
    expect(within(details!).getByText('Sотверстие_ствол — площадь области на цилиндрической развёртке ствола, которая попадает внутрь цилиндра врезки.')).toBeInTheDocument()
    expect(within(details!).getByText('Sврезка_седловая — площадь врезки по седловой развёртке, то есть по переменной длине Lэфф(φ), полученной из линии пересечения двух цилиндров.')).toBeInTheDocument()
    expect(within(details!).getByText('KRG-006 использует ту же базовую геометрию пересечения цилиндров, что KRG-005; нестандартность задаётся параметрами угла, положения, диаметров и длин.')).toBeInTheDocument()
    expect(within(details!).getByText('Внедрить расчёт нестандартного пересечения цилиндров в engine и покрыть тестами по Excel-базе CAMduct.')).toBeInTheDocument()

    const capRow = screen.getByText('KRG-007').closest('tr')
    expect(capRow).not.toBeNull()
    fireEvent.click(capRow!)

    expect(capRow).toHaveAttribute('aria-selected', 'true')
    expect(within(details!).getByText('Заглушка круглая')).toBeInTheDocument()
    expect(within(details!).getByText('Условная — прямой CAMduct/Excel-формулы в найденных источниках пока нет.')).toBeInTheDocument()
    expect(within(details!).getByText('Нужен вывод формулы')).toBeInTheDocument()
    expect(within(details!).getByText('Sчистовая = Sдиск + Sобечайка')).toBeInTheDocument()
    expect(within(details!).getByText('Sдиск = π × D² / 4')).toBeInTheDocument()
    expect(within(details!).getByText('Методичка: заглушка состоит из обечайки и круглого основания.')).toBeInTheDocument()
    expect(within(details!).getByText('Не считать формулу проверенной до подтверждения CAMduct/Excel.')).toBeInTheDocument()
    expect(within(details!).getByText('Подтвердить наличие бурта/отбортовки по CAMduct и покрыть тестами.')).toBeInTheDocument()

    const roundInsetRow = screen.getByText('KRG-008').closest('tr')
    expect(roundInsetRow).not.toBeNull()
    fireEvent.click(roundInsetRow!)

    expect(roundInsetRow).toHaveAttribute('aria-selected', 'true')
    expect(within(details!).getByText('Врезка круглая')).toBeInTheDocument()
    expect(within(details!).getByText('Нужен вывод формулы')).toBeInTheDocument()
    expect(within(details!).queryByText('По аналогии с KRG-005')).not.toBeInTheDocument()
    expect(within(details!).getByText('Вариант 1: Sпатрубок = π × d × H')).toBeInTheDocument()
    expect(
      within(details!).getByText(
        'Если отбортовка q входит в развёртку патрубка: Sполная = π × d × (H + q) + технологические припуски',
      ),
    ).toBeInTheDocument()
    expect(within(details!).getByText('Вариант 2: Sкольцо = π × ((d + 2 × bкольца)² − d²) / 4')).toBeInTheDocument()
    expect(
      within(details!).getByText(
        'Вариант 3: если отверстие вырезается из пластины, Sчистовая = Sпатрубок + Sпластина − Sотверстие',
      ),
    ).toBeInTheDocument()
    expect(within(details!).getByText('Вариант 4: Dмал = d; Dбол = d / sin(α)')).toBeInTheDocument()
    expect(
      within(details!).getByText('Вариант 4: Sотверстие_овал = π × Dмал × Dбол / 4 = π × d² / (4 × sin(α))'),
    ).toBeInTheDocument()
    expect(
      within(details!).getByText(
        'Вариант 4: Sкольцо_овал = π × Dмал_наруж × Dбол_наруж / 4 − π × Dмал_внутр × Dбол_внутр / 4',
      ),
    ).toBeInTheDocument()
    expect(within(details!).queryByText('Sврезка_седловая = ∫ r × Lэфф(φ) dφ')).not.toBeInTheDocument()
    expect(within(details!).getByText('Методичка: врезку сваривают по шву S2(Fa)/S2(Ma), накатывают зиг и формируют отбортовку 10 мм.')).toBeInTheDocument()
    expect(
      within(details!).getByText(
        'KRG-008 имеет варианты конструкции: цельный патрубок на сварке, патрубок с отдельным кольцом под отбортовку, патрубок на прямоугольной пластине, а также угловая врезка, где отверстие на пластине становится овальным/эллиптическим. Выбор варианта, включение отбортовки/кольца/пластины и способ расчёта овального бурта должны быть подтверждены по CAMduct.',
      ),
    ).toBeInTheDocument()
    expect(
      within(details!).getByText(
        'Подтвердить в CAMduct варианты KRG-008: цельный патрубок, кольцо под отбортовку, прямоугольная пластина, угловая врезка с овальным отверстием/буртом; затем покрыть тестами.',
      ),
    ).toBeInTheDocument()

    const saddleRow = screen.getByText('KRG-009').closest('tr')
    expect(saddleRow).not.toBeNull()
    fireEvent.click(saddleRow!)

    expect(saddleRow).toHaveAttribute('aria-selected', 'true')
    expect(within(details!).getByText('Седло')).toBeInTheDocument()
    expect(within(details!).getByText('Нужен вывод формулы')).toBeInTheDocument()
    expect(within(details!).getByText('Методичка по седлу + геометрия пересечения двух цилиндров.')).toBeInTheDocument()
    expect(
      within(details!).getByText('Если KRG-009 является только седловым основанием/накладкой: Sчистовая = Sседло'),
    ).toBeInTheDocument()
    expect(
      within(details!).getByText('Если KRG-009 включает патрубок: Sчистовая = Sседло + Sпатрубок_седловой'),
    ).toBeInTheDocument()
    expect(
      within(details!).getByText(
        'Sотверстие_ствол = ∬ R dθ dx по области точек P(x, θ), которые находятся внутри цилиндра врезки.',
      ),
    ).toBeInTheDocument()
    expect(
      within(details!).getByText(
        'Sседло — площадь основания на поверхности круглого ствола вокруг линии пересечения ствола и врезки.',
      ),
    ).toBeInTheDocument()
    expect(
      within(details!).getByText(
        'Если патрубок входит в KRG-009: Sпатрубок_седловой = ∫ r × Lэфф(φ) dφ.',
      ),
    ).toBeInTheDocument()
    expect(
      within(details!).getByText(
        'Открытый вопрос: как CAMduct задаёт наружную границу седла — равномерным отступом по развёртке, габаритным увеличением, табличной формой или другим производственным правилом.',
      ),
    ).toBeInTheDocument()
    expect(
      within(details!).getByText(
        'Следующее действие: подтвердить в CAMduct состав KRG-009: только седло или седло с патрубком, способ задания наружной границы седла и припуски; затем покрыть тестами.',
      ),
    ).toBeInTheDocument()

    const nippleRow = screen.getByText('KRG-010').closest('tr')
    expect(nippleRow).not.toBeNull()
    fireEvent.click(nippleRow!)

    expect(nippleRow).toHaveAttribute('aria-selected', 'true')
    expect(within(details!).getByText('Ниппель круглый')).toBeInTheDocument()
    expect(within(details!).getByText('Нужен вывод формулы')).toBeInTheDocument()
    expect(
      within(details!).getByText('KRG-010 — внутренний соединительный элемент: ниппель вставляется внутрь соединяемых труб.'),
    ).toBeInTheDocument()
    expect(within(details!).getByText('Sчистовая = π × dниппеля × L')).toBeInTheDocument()
    expect(within(details!).getByText('Если источник задаёт уменьшенный посадочный диаметр: dниппеля = Dном − Δпосадки')).toBeInTheDocument()
    expect(within(details!).getByText('L = Lлевая + Lправая + зона_зига')).toBeInTheDocument()
    expect(
      within(details!).getByText(
        'Если CAMduct учитывает зиг как добавку к развёртке: Sполная = π × dниппеля × (L + Δзиг) + технологические припуски',
      ),
    ).toBeInTheDocument()
    expect(
      within(details!).getByText('Не переносить S1 из KRG-001 автоматически без подтверждения для KRG-010.'),
    ).toBeInTheDocument()
    expect(
      within(details!).getByText('Не смешивать KRG-010 с KRG-019: ниппель вставляется внутрь трубы, муфта надевается снаружи.'),
    ).toBeInTheDocument()
    expect(
      within(details!).getByText('У ниппеля зиг прокатывается наружу и расположен посередине как ограничитель упора.'),
    ).toBeInTheDocument()
    expect(
      within(details!).getByText('Муфтовое соединение противоположно: муфта надевается снаружи на трубы, а зиг прокатывается внутрь.'),
    ).toBeInTheDocument()
    expect(
      within(details!).getByText(
        'Следующее действие: подтвердить по CAMduct длину ниппеля, посадочный диаметр, наружный зиг, припуски и отличие от муфты; затем покрыть тестами.',
      ),
    ).toBeInTheDocument()

    const silencerRow = screen.getByText('KRG-011').closest('tr')
    expect(silencerRow).not.toBeNull()
    fireEvent.click(silencerRow!)

    expect(silencerRow).toHaveAttribute('aria-selected', 'true')
    expect(within(details!).getByText('Шумоглушитель круглый')).toBeInTheDocument()
    expect(within(details!).getByText('Нужен вывод формулы')).toBeInTheDocument()
    expect(
      within(details!).getByText(
        'KRG-011 — составное изделие: наружный корпус, две торцевые заглушки и два проходных патрубка подключения.',
      ),
    ).toBeInTheDocument()
    expect(within(details!).getByText('Sчистовая = Sкорпус_наружный + Sзаглушки + Sпатрубки_подключения')).toBeInTheDocument()
    expect(within(details!).getByText('Sкорпус_наружный = π × Dкорпуса × Lкорпуса')).toBeInTheDocument()
    expect(
      within(details!).getByText(
        'Если заглушка плоская и отверстие под патрубок вырезается: Sзаглушка = π × Dкорпуса² / 4 − π × dподкл² / 4',
      ),
    ).toBeInTheDocument()
    expect(
      within(details!).getByText('Если отверстия в заглушках не вычитаются по CAMduct: Sзаглушки = 2 × (π × Dкорпуса² / 4)'),
    ).toBeInTheDocument()
    expect(
      within(details!).getByText(
        'Lпатрубка = Lнаружу + Lвнутрь; типовое проверяемое правило: 50 мм наружу + 50 мм внутрь = 100 мм',
      ),
    ).toBeInTheDocument()
    expect(within(details!).getByText('Для двух патрубков: Sпатрубки_подключения = 2 × Sпатрубок')).toBeInTheDocument()
    expect(
      within(details!).getByText(
        'Не считать KRG-011 простой трубой KRG-001: это составное изделие с корпусом, заглушками и проходными патрубками.',
      ),
    ).toBeInTheDocument()
    expect(
      within(details!).getByText(
        'Утеплитель, шумопоглотитель и сетка не включаются в формулу площади листового металла KRG-011; это будущие компоненты BOM/спецификации без добавления массы в этой карточке.',
      ),
    ).toBeInTheDocument()
    expect(
      within(details!).getByText(
        'Следующее действие: подтвердить по CAMduct: вычитание отверстий в заглушках, длину патрубков 50/50, швы/замки и припуски; затем покрыть тестами.',
      ),
    ).toBeInTheDocument()

    const umbrellaRow = screen.getByText('KRG-012').closest('tr')
    expect(umbrellaRow).not.toBeNull()
    fireEvent.click(umbrellaRow!)

    expect(umbrellaRow).toHaveAttribute('aria-selected', 'true')
    expect(within(details!).getByText('Зонт круглый')).toBeInTheDocument()
    expect(within(details!).getByText('Нужен вывод формулы')).toBeInTheDocument()
    expect(within(details!).getByText('Не считать KRG-012 круглой заглушкой без подтверждения источником.')).toBeInTheDocument()
    expect(within(details!).getByText('Если зонт — конический колпак без отверстия: Sконус = π × R × l')).toBeInTheDocument()
    expect(
      within(details!).getByText(
        'Если зонт — усечённый конус с посадочным отверстием: Sусечённый_конус = π × (Rнаруж + Rвнутр) × l',
      ),
    ).toBeInTheDocument()
    expect(within(details!).getByText('Для усечённого конуса: l = √((Rнаруж − Rвнутр)² + H²)')).toBeInTheDocument()
    expect(
      within(details!).getByText('Если есть посадочный цилиндрический патрубок: Sпатрубок = π × Dпосадочный × hпатрубка'),
    ).toBeInTheDocument()
    expect(
      within(details!).getByText('Базово для зонта с усечённым конусом и патрубком: Sчистовая = Sусечённый_конус + Sпатрубок'),
    ).toBeInTheDocument()
    expect(
      within(details!).getByText('Если стойки/крепления входят в расчёт CAMduct: Sкрепления = сумма площадей металлических креплений по источнику'),
    ).toBeInTheDocument()
    expect(within(details!).getByText('Не переносить S1 из KRG-001 автоматически без подтверждения для KRG-012.')).toBeInTheDocument()
    expect(
      within(details!).getByText(
        'Посадочный патрубок, круглая крышка/диск, стойки/крепления и технологические припуски не входят в Sчистовая без подтверждения источником.',
      ),
    ).toBeInTheDocument()
    expect(within(details!).getByText('Следующее действие: подтвердить параметры и состав KRG-012 по CAMduct.')).toBeInTheDocument()
  })

  it('shows formula navigation only for roles that can view formula details', async () => {
    await i18n.changeLanguage('ru')
    useAppStore.setState({ role: 'guest' })

    const { rerender } = render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    )

    expect(screen.queryByRole('link', { name: 'Формулы' })).not.toBeInTheDocument()

    useAppStore.setState({ role: 'admin' })
    rerender(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Формулы' })).toHaveAttribute('href', '/formulas')
  })
})
