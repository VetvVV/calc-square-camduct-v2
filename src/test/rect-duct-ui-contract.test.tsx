import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { RectDuctCalculator } from '../components/Calculator/RectDuctCalculator'
import { createEmptyProject } from '../domain/specification/itemFactory'
import i18n from '../i18n'
import { useAppStore } from '../store/appStore'
import { useProjectStore } from '../store/projectStore'

describe('RECT-001 UI contract', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('ru')
    useAppStore.setState({ activeModule: 'rect-duct', role: 'guest', camductMode: false })
    useProjectStore.setState({ project: createEmptyProject(), editingItemId: null, editingDraft: null })
  })

  it('shows product UI without internal terms and opens invitation for guest add', () => {
    const { container } = render(
      <MemoryRouter>
        <RectDuctCalculator />
      </MemoryRouter>,
    )

    expect(screen.getByText('RECT-001 / Прямоугольный воздуховод')).toBeInTheDocument()
    expect(screen.getByText('Расчётный модуль')).toBeInTheDocument()
    expect(screen.getByText(/A 400 × B 300 × L 1000 мм/)).toBeInTheDocument()
    expect(screen.getAllByText(/Прямоугольный воздуховод/).length).toBeGreaterThan(0)
    expect(screen.getByText(/Результат обновляется автоматически при изменении параметров/)).toBeInTheDocument()

    const visibleText = container.textContent ?? ''
    expect(visibleText).not.toContain('CAMduct')
    expect(visibleText).not.toContain('V1')
    expect(visibleText).not.toContain('V2')
    expect(visibleText).not.toContain('MVP')
    expect(visibleText).not.toContain('debug')
    expect(visibleText).not.toContain('internal')
    expect(visibleText).not.toContain('moduleKey')

    fireEvent.click(screen.getByRole('button', { name: /Добавить в проект/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/Приглашение к сотрудничеству/i)).toBeInTheDocument()
    expect(useProjectStore.getState().project.items).toHaveLength(0)
  })
})


