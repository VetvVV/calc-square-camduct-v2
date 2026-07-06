import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
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
    const { container, unmount } = renderSplit('/split?module=round-duct')
    expect(screen.getByText('R-001 / Труба прямошовная')).toBeInTheDocument()
    expect(screen.getByText('Расчётный модуль')).toBeInTheDocument()
    expect(screen.getByText('ОПЫТНЫЙ ОБРАЗЕЦ')).toBeInTheDocument()
    expect(screen.queryByLabelText('Режим доступа')).not.toBeInTheDocument()
    const inputRow = container.querySelector('.r001-split-input-row')
    expect(inputRow).toBeInTheDocument()
    expect(inputRow?.firstElementChild).toHaveClass('r001-split-visual')
    expect(inputRow?.lastElementChild).toHaveClass('r001-split-fields')
    expect(container.querySelector('.r001-spec-block')).toBeInTheDocument()
    expect(screen.getByLabelText('Схема трубы прямошовной')).toHaveTextContent('D 125')
    expect(screen.getByLabelText('Схема трубы прямошовной')).toHaveTextContent('L 1000')
    expect(screen.getByLabelText('Схема трубы прямошовной')).not.toHaveTextContent('Ø')
    expect(screen.getByLabelText('Схема трубы прямошовной')).not.toHaveTextContent('A 125')
    expect(screen.getByLabelText('Схема трубы прямошовной')).not.toHaveTextContent('B 1000')
    expect(screen.queryByRole('button', { name: 'Ознакомительный расчёт' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Ознакомительный доступ' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Рабочий кабинет подключён' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Администрирование' })).not.toBeInTheDocument()
    expect(screen.getByLabelText('R-001 рабочий калькулятор')).toHaveTextContent('D / Диаметр, мм')
    expect(screen.getByLabelText('R-001 рабочий калькулятор')).toHaveTextContent('L / Длина, мм')
    expect(screen.getByLabelText('R-001 рабочий калькулятор')).toHaveTextContent('Опции')
    expect(screen.queryByText('Торцевое соединение 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Торцевое соединение 2')).not.toBeInTheDocument()
    expect(screen.queryByText('Тип внутреннего соединения')).not.toBeInTheDocument()
    expect(screen.queryByText('Сервис OFF')).not.toBeInTheDocument()
    expect(screen.queryByText('Алюминий')).not.toBeInTheDocument()
    expect(screen.queryByText('Масса:')).not.toBeInTheDocument()
    expect(document.body.textContent).not.toContain('Опытный UI-прототип')
    expect(document.body.textContent).not.toContain('Тестовый режим прототипа')
    expect(document.body.textContent).not.toContain('прототип')

    unmount()
    renderSplit('/split?module=spiral-duct')
    expect(screen.getByText('R-sp-001 / Спирально-навивная труба')).toBeInTheDocument()
  })

  it('adds R-001 from the split right panel with selected material and quantity', () => {
    const { container } = renderSplit('/split?module=round-duct')

    fireEvent.change(screen.getByLabelText('Количество'), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText('Материал'), { target: { value: 'ss304' } })
    const areaBeforeHoles = container.querySelector('.r001-spec-area')?.textContent
    fireEvent.click(screen.getByRole('button', { name: /Опции/ }))
    expect(screen.queryByText(/Отверстий: 0/)).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Добавить отверстие' }))
    expect(screen.getByRole('dialog', { name: 'Отверстие' })).toBeInTheDocument()
    expect(screen.getByLabelText('Форма отверстия')).toHaveTextContent('Круглое')
    expect(screen.getByLabelText('Форма отверстия')).toHaveTextContent('Прямоугольное')
    expect(screen.getByLabelText('Сторона')).toHaveTextContent('Верх')
    expect(screen.getByLabelText('Ширина, мм')).toHaveValue(200)
    expect(screen.getByLabelText('Высота, мм')).toHaveValue(100)
    expect(screen.getByLabelText('Положение по длине, мм')).toHaveValue(500)
    fireEvent.change(screen.getByLabelText('Форма отверстия'), { target: { value: 'round' } })
    expect(screen.getByLabelText('Диаметр, мм')).toHaveValue(200)
    expect(screen.queryByLabelText('Высота, мм')).not.toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Диаметр, мм'), { target: { value: '100' } })
    fireEvent.click(screen.getByRole('button', { name: 'Добавить' }))
    expect(screen.getByText('Отверстий: 1')).toBeInTheDocument()
    expect(screen.getByText('Отверстия: круглое D 100 мм × 1')).toBeInTheDocument()
    expect(container.querySelector('.r001-split-visual circle')).toBeInTheDocument()

    let cards = container.querySelectorAll('.r001-hole-card')
    fireEvent.change(within(cards[0] as HTMLElement).getByLabelText('Диаметр, мм'), { target: { value: '120' } })
    expect(screen.getByText('Отверстия: круглое D 120 мм × 1')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Добавить отверстие' }))
    const rectDialog = screen.getByRole('dialog', { name: 'Отверстие' })
    fireEvent.change(within(rectDialog).getByLabelText('Ширина, мм'), { target: { value: '200' } })
    fireEvent.change(within(rectDialog).getByLabelText('Высота, мм'), { target: { value: '100' } })
    fireEvent.change(within(rectDialog).getByLabelText('Количество'), { target: { value: '2' } })
    fireEvent.click(within(rectDialog).getByRole('button', { name: 'Добавить' }))
    expect(screen.getByText('Отверстий: 3')).toBeInTheDocument()
    expect(screen.getByText('Отверстия: круглое D 120 мм × 1; прямоугольное 200×100 мм × 2')).toBeInTheDocument()
    expect(container.querySelector('.r001-split-visual rect')).toBeInTheDocument()

    cards = container.querySelectorAll('.r001-hole-card')
    fireEvent.change(within(cards[1] as HTMLElement).getByLabelText('Ширина, мм'), { target: { value: '220' } })
    fireEvent.change(within(cards[1] as HTMLElement).getByLabelText('Высота, мм'), { target: { value: '110' } })
    expect(screen.getByText('Отверстия: круглое D 120 мм × 1; прямоугольное 220×110 мм × 2')).toBeInTheDocument()

    fireEvent.click(within(cards[0] as HTMLElement).getByRole('button', { name: 'Удалить отверстие' }))
    expect(screen.getByText('Отверстий: 2')).toBeInTheDocument()
    expect(screen.getByText('Отверстия: прямоугольное 220×110 мм × 2')).toBeInTheDocument()
    expect(screen.queryByText(/круглое D 120/)).not.toBeInTheDocument()
    expect(container.querySelector('.r001-spec-area')?.textContent).toBe(areaBeforeHoles)
    fireEvent.click(screen.getByRole('button', { name: 'Добавить в проект' }))

    const project = useProjectStore.getState().project
    expect(project.items).toHaveLength(1)
    expect(project.items[0].moduleKey).toBe('round-duct')
    expect(project.items[0].quantity).toBe(3)
    expect(project.items[0].options.material).toBe('ss304')
    expect(project.items[0].options.thickness).toBe(0.5)
    expect(project.items[0].parameters.A).toBe(125)
    expect(project.items[0].parameters.B).toBe(1000)
    expect(project.items[0].parameters.holes).toBe(2)
    expect(project.items[0].moduleMetadata.holesCount).toBe(2)
    expect(project.items[0].moduleMetadata.holesDescription).toBe('Отверстия: прямоугольное 220×110 мм × 2')
    expect(project.items[0].moduleMetadata.holes).toEqual([
      { id: 2, shape: 'rectangular', side: 'top', size1: 220, size2: 110, position: 500, quantity: 2 },
    ])
    expect(screen.getAllByText(/Отверстия: прямоугольное 220×110 мм × 2/).length).toBeGreaterThanOrEqual(2)
    expect(screen.getByRole('button', { name: 'Добавлено в проект' })).toBeInTheDocument()
  })
})
