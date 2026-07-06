import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { NavBar } from '../components/Layout/NavBar'
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

  it('renders engineering formula cards for service mode', () => {
    useAppStore.setState({ role: 'service' })

    render(<FormulaCardsPage />)

    expect(screen.getByRole('heading', { name: 'Формулы / инженерная справка' })).toBeInTheDocument()
    expect(screen.getByText('Главный показатель для расхода материала — Sполная. Масса и количество здесь не считаются.')).toBeInTheDocument()

    for (const code of ['KRG-001', 'PRM-001', 'PRM-010', 'KMB-004', 'KRG-003', 'KRG-004']) {
      expect(screen.getByText(code)).toBeInTheDocument()
    }
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
