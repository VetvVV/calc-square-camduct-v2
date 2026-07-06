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
    expect(screen.getAllByText('Нужна сверка с CAMduct').length).toBeGreaterThan(0)

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
