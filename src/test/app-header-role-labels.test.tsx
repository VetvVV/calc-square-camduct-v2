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
    expect(screen.getByLabelText('Текущий язык')).toHaveTextContent('RU')
    expect(screen.queryByRole('button', { name: 'RU' })).not.toBeInTheDocument()
  })

  it('keeps the active language switcher on non KRG-001 routes', async () => {
    await i18n.changeLanguage('ru')
    useAppStore.setState({ activeModule: 'round-duct', role: 'guest', camductMode: false })

    render(
      <MemoryRouter initialEntries={['/atlas']}>
        <AppHeader />
      </MemoryRouter>,
    )

    expect(screen.queryByLabelText('Текущий язык')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'RU' })).toBeInTheDocument()
  })

  it('shows a static language badge on the KRG-001 prototype route', async () => {
    await i18n.changeLanguage('ru')
    useAppStore.setState({ activeModule: 'round-duct', role: 'guest', camductMode: false })

    render(
      <MemoryRouter initialEntries={['/prototype/r001']}>
        <AppHeader />
      </MemoryRouter>,
    )

    expect(screen.getByLabelText('Текущий язык')).toHaveTextContent('RU')
    expect(screen.queryByRole('button', { name: 'RU' })).not.toBeInTheDocument()
  })
})
