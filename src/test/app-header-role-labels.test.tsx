import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { AppHeader } from '../components/Layout/AppHeader'
import { useAppStore } from '../store/appStore'

describe('app header access labels', () => {
  afterEach(() => {
    cleanup()
  })

  it('shows public access labels instead of internal role names', () => {
    useAppStore.setState({ activeModule: 'round-duct', role: 'guest', camductMode: false })

    render(
      <MemoryRouter initialEntries={['/split?module=round-duct']}>
        <AppHeader />
      </MemoryRouter>,
    )

    const roleSelect = screen.getByLabelText('role')
    const labels = within(roleSelect).getAllByRole('option').map((option) => option.textContent)

    expect(labels).toEqual([
      'Ознакомительный расчёт',
      'Ознакомительный доступ',
      'Рабочий кабинет подключён',
      'Администрирование',
      'Администрирование',
    ])
    expect(labels).not.toContain('Гость')
    expect(labels).not.toContain('Работа')
    expect(labels).not.toContain('Клиент')
    expect(labels).not.toContain('Сервис')
    expect(labels).not.toContain('Админ')
  })
})
