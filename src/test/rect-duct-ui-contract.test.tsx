import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { RectDuctCalculator } from '../components/Calculator/RectDuctCalculator'
import { createEmptyProject } from '../domain/specification/itemFactory'
import i18n from '../i18n'
import { useAppStore } from '../store/appStore'
import { useProjectStore } from '../store/projectStore'

function renderRectCalculator() {
  return render(
    <MemoryRouter>
      <RectDuctCalculator />
    </MemoryRouter>,
  )
}

describe('RECT-001 UI contract', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('ru')
    useAppStore.setState({ activeModule: 'rect-duct', role: 'guest', camductMode: false })
    useProjectStore.setState({ project: createEmptyProject(), editingItemId: null, editingDraft: null })
  })

  afterEach(() => {
    cleanup()
  })

  it('shows product UI without internal terms and opens invitation for guest add', () => {
    const { container } = renderRectCalculator()

    expect(screen.getByText('RECT-001 / Прямоугольный воздуховод')).toBeInTheDocument()
    expect(screen.getByText('Расчётный модуль')).toBeInTheDocument()
    expect(screen.getByText('A — Ширина, мм')).toBeInTheDocument()
    expect(screen.getByText('B — Высота, мм')).toBeInTheDocument()
    expect(screen.getByText('C — Длина, мм')).toBeInTheDocument()
    expect(screen.queryByText('L — Длина, мм')).not.toBeInTheDocument()
    expect(screen.getByText(/A 400 × B 300 × C 1000 мм/)).toBeInTheDocument()
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
    expect(visibleText).not.toContain('calculation core')
    expect(visibleText).not.toContain('migration kit')

    fireEvent.click(screen.getByRole('button', { name: /Добавить в проект/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/Приглашение к сотрудничеству/i)).toBeInTheDocument()
    expect(useProjectStore.getState().project.items).toHaveLength(0)
  })

  it('shows CAMduct service labels only for service/admin roles with service mode enabled', () => {
    useAppStore.setState({ activeModule: 'rect-duct', role: 'service', camductMode: true })

    const { container } = renderRectCalculator()
    const visibleText = container.textContent ?? ''

    expect(screen.getByText('A / Ширина, мм')).toBeInTheDocument()
    expect(screen.getByText('B / Высота, мм')).toBeInTheDocument()
    expect(screen.getByText('C / Длина, мм')).toBeInTheDocument()
    expect(visibleText).not.toContain('L /')
    expect(visibleText).not.toContain('L / Длина')
  })

  it('keeps ordinary client labels without service-only A/B/C slashes', () => {
    useAppStore.setState({ activeModule: 'rect-duct', role: 'client', camductMode: true })

    const { container } = renderRectCalculator()
    const visibleText = container.textContent ?? ''

    expect(screen.getByText('A — Ширина, мм')).toBeInTheDocument()
    expect(screen.getByText('B — Высота, мм')).toBeInTheDocument()
    expect(screen.getByText('C — Длина, мм')).toBeInTheDocument()
    expect(visibleText).not.toContain('A / Ширина')
    expect(visibleText).not.toContain('B / Высота')
    expect(visibleText).not.toContain('C / Длина')
    expect(visibleText).not.toContain('L — Длина')
  })
})
