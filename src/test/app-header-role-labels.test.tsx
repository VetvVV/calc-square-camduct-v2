import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { AppHeader } from '../components/Layout/AppHeader'
import i18n from '../i18n'
import { useAppStore } from '../store/appStore'

describe('app header role and access labels', () => {
  afterEach(() => {
    cleanup()
  })

  it('shows role labels in the selector and access mode as a separate badge', async () => {
    await i18n.changeLanguage('ru')
    useAppStore.setState({ activeModule: 'round-duct', role: 'guest', camductMode: false })

    render(
      <MemoryRouter initialEntries={['/split?module=round-duct']}>
        <AppHeader />
      </MemoryRouter>,
    )

    const roleSelect = screen.getByLabelText('role')
    const labels = within(roleSelect).getAllByRole('option').map((option) => option.textContent)

    expect(labels).toEqual([
      'Гость',
      'Работа',
      'Клиент',
      'Админ',
      'Сервис',
    ])
    expect(labels).not.toContain('Ознакомительный расчёт')
    expect(screen.getByLabelText('Режим доступа')).toHaveTextContent('Ознакомительный расчёт')
  })
})
