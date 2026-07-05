import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { SplitPage } from '../pages/SplitPage'
import { createEmptyProject } from '../domain/specification/itemFactory'
import i18n from '../i18n'
import { useAppStore } from '../store/appStore'
import { useProjectStore } from '../store/projectStore'

function renderSplit(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/split" element={<SplitPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('split page query module routing', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('ru')
    useAppStore.setState({ activeModule: 'round-duct', role: 'client', camductMode: false })
    useProjectStore.setState({ project: createEmptyProject(), editingItemId: null, editingDraft: null })
  })

  afterEach(() => {
    cleanup()
  })

  it('opens the RECT-001 calculator for /split?module=rect-duct', () => {
    renderSplit('/split?module=rect-duct')

    expect(screen.getByText('RECT-001 / Прямоугольный воздуховод')).toBeInTheDocument()
    expect(screen.queryByText('R-001 / Труба прямошовная')).not.toBeInTheDocument()
  })

  it('keeps round and spiral query modules openable in split', () => {
    const { unmount } = renderSplit('/split?module=round-duct')
    expect(screen.getByText('R-001 / Труба прямошовная')).toBeInTheDocument()
    expect(screen.getByText('ОПЫТНЫЙ ОБРАЗЕЦ')).toBeInTheDocument()
    expect(screen.getByLabelText('Тестовый режим прототипа')).toBeInTheDocument()
    expect(screen.getByLabelText('R-001 рабочий калькулятор')).toHaveTextContent('D / Диаметр, мм')
    expect(screen.getByLabelText('R-001 рабочий калькулятор')).toHaveTextContent('L / Длина, мм')
    expect(screen.getByLabelText('R-001 рабочий калькулятор')).toHaveTextContent('Опции')
    expect(screen.queryByText('Торцевое соединение 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Торцевое соединение 2')).not.toBeInTheDocument()
    expect(screen.queryByText('Тип внутреннего соединения')).not.toBeInTheDocument()
    expect(screen.queryByText('Сервис OFF')).not.toBeInTheDocument()
    expect(screen.queryByText('Алюминий')).not.toBeInTheDocument()
    expect(screen.queryByText('Масса:')).not.toBeInTheDocument()

    unmount()
    renderSplit('/split?module=spiral-duct')
    expect(screen.getByText('R-sp-001 / Спирально-навивная труба')).toBeInTheDocument()
  })

  it('adds R-001 from the split right panel with selected material and quantity', () => {
    renderSplit('/split?module=round-duct')

    fireEvent.change(screen.getByLabelText('Количество'), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText('Материал'), { target: { value: 'ss304' } })
    fireEvent.click(screen.getByRole('button', { name: 'Добавить в проект' }))

    const project = useProjectStore.getState().project
    expect(project.items).toHaveLength(1)
    expect(project.items[0].moduleKey).toBe('round-duct')
    expect(project.items[0].quantity).toBe(3)
    expect(project.items[0].options.material).toBe('ss304')
    expect(project.items[0].options.thickness).toBe(0.5)
    expect(project.items[0].parameters.A).toBe(125)
    expect(project.items[0].parameters.B).toBe(1000)
    expect(screen.getByRole('button', { name: 'Добавлено в проект' })).toBeInTheDocument()
  })
})
