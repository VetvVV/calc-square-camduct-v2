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
