import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { R001PrototypePage } from '../pages/R001PrototypePage'
import { calculateR001PrototypeDemo } from '../prototypes/r001DemoEngine'

const chipText = () => document.querySelector('.r001-status-chip')?.textContent

const setState = (name: string) =>
  fireEvent.click(within(screen.getByLabelText('Тестовый режим прототипа')).getByRole('button', { name }))

describe('R-001 prototype demo engine', () => {
  it('calculates the short welded seam demo case', () => {
    const result = calculateR001PrototypeDemo({ diameter: 125, length: 400, thickness: 0.5 })
    expect(result.seamType).toBe('точка 3/0')
    expect(result.allowance).toBe(8)
    expect(result.unfoldWidth).toBeCloseTo(400.699, 3)
    expect(result.area).toBeCloseTo(0.16, 3)
  })

  it('calculates the long 0.5 mm russian lock demo case', () => {
    const result = calculateR001PrototypeDemo({ diameter: 125, length: 1000, thickness: 0.5 })
    expect(result.seamType).toBe('12.5/12.5')
    expect(result.unfoldWidth).toBeCloseTo(417.699, 3)
    expect(result.area).toBeCloseTo(0.418, 3)
  })

  it('calculates the long 0.9 mm russian lock demo case', () => {
    const result = calculateR001PrototypeDemo({ diameter: 125, length: 1000, thickness: 0.9 })
    expect(result.seamType).toBe('14/14')
    expect(result.unfoldWidth).toBeCloseTo(420.699, 3)
    expect(result.area).toBeCloseTo(0.421, 3)
  })
})

describe('R-001 prototype public UI', () => {
  afterEach(() => {
    cleanup()
  })

  it('uses public labels and hides CAMduct / engineering data', () => {
    render(<R001PrototypePage />)
    expect(screen.getByLabelText('D / Диаметр, мм')).toBeInTheDocument()
    expect(document.body.textContent).not.toContain('Ø')
    expect(document.body.textContent).not.toContain('Итог по позиции')
    expect(document.body.textContent).not.toContain('Service')
    expect(document.body.textContent).not.toContain('Сервис')
    expect(screen.queryByText(/S1/)).not.toBeInTheDocument()
    expect(screen.queryByText(/точка 3\/0/)).not.toBeInTheDocument()
    expect(screen.queryByText(/масса/i)).not.toBeInTheDocument()
    expect(screen.queryByText('Показать debug')).not.toBeInTheDocument()
    // watermark присутствует, но не мешает (aria-hidden)
    expect(document.querySelector('.r001-watermark')?.getAttribute('aria-hidden')).toBe('true')
  })

  it('shows friendly access status instead of internal roles', () => {
    render(<R001PrototypePage />)
    expect(chipText()).toBe('Ознакомительный расчёт')
    setState('Ознакомительный доступ')
    expect(chipText()).toBe('Ознакомительный доступ')
    setState('Рабочий кабинет подключён')
    expect(chipText()).toBe('Рабочий кабинет подключён')
    expect(document.body.textContent).not.toContain('Guest')
    expect(document.body.textContent).not.toContain('Client')
  })

  it('guest add-to-project button is muted, clickable and opens the invitation dialog', () => {
    render(<R001PrototypePage />)
    const addButton = screen.getByRole('button', { name: 'Добавить в проект' })
    expect(addButton).toHaveClass('is-muted')
    expect(addButton).not.toBeDisabled()
    expect(addButton).not.toHaveStyle({ pointerEvents: 'none' })
    fireEvent.click(addButton)
    expect(screen.getByRole('dialog', { name: 'Выберите формат сотрудничества' })).toBeInTheDocument()
    expect(screen.getByText('Спецификация · 0 позиции')).toBeInTheDocument()
  })

  it('user access adds separate positions per click with the current quantity', () => {
    render(<R001PrototypePage />)
    setState('Ознакомительный доступ')
    const plus = screen.getByRole('button', { name: 'Увеличить количество' })
    fireEvent.click(plus)
    fireEvent.click(plus)
    const add = screen.getByRole('button', { name: 'Добавить в проект' })
    expect(add).toHaveClass('r001-primary')
    fireEvent.click(add)
    fireEvent.click(add)
    expect(screen.getByText('Спецификация · 2 позиции')).toBeInTheDocument()
  })

  it('add-to-project shows transient confirmation on the button itself', () => {
    render(<R001PrototypePage />)
    setState('Рабочий кабинет подключён')
    fireEvent.click(screen.getByRole('button', { name: 'Добавить в проект' }))
    expect(screen.getByRole('button', { name: 'Добавлено в проект' })).toBeInTheDocument()
    expect(document.body.textContent).not.toContain('Показать спецификацию')
  })

  it('invitation dialog connects the working cabinet in the prototype', () => {
    render(<R001PrototypePage />)
    fireEvent.click(screen.getByRole('button', { name: 'Добавить в проект' }))
    fireEvent.click(screen.getByRole('button', { name: 'Запросить КП' }))
    expect(screen.getByText('Запрос принят. Менеджер свяжется с вами для подключения доступа.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))
    expect(chipText()).toBe('Рабочий кабинет подключён')
  })

  it('exhausted guest calc limit opens the dialog instead of recomputing', () => {
    render(<R001PrototypePage />)
    const diameter = screen.getByLabelText('D / Диаметр, мм')
    for (let step = 0; step < 6; step += 1) {
      fireEvent.change(diameter, { target: { value: String(200 + step * 10) } })
    }
    expect(screen.getByRole('dialog', { name: 'Выберите формат сотрудничества' })).toBeInTheDocument()
  })

  it('admin engineering toggle reveals engineering data and resets when leaving admin', () => {
    render(<R001PrototypePage />)
    setState('Администрирование')
    const toggle = screen.getByRole('button', { name: 'Инженерный режим выключен' })
    fireEvent.click(toggle)
    expect(screen.getByLabelText('Service diagnostics')).toHaveTextContent('S1 = 12.5/12.5')
    expect(screen.getByLabelText('Service diagnostics')).toHaveTextContent('mass =')
    // выход из admin сбрасывает инженерный режим
    setState('Ознакомительный расчёт')
    expect(screen.queryByLabelText('Service diagnostics')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /⚙/ })).not.toBeInTheDocument()
  })

  it('opens the public hole dialog from the Options block', () => {
    render(<R001PrototypePage />)
    fireEvent.click(screen.getByRole('button', { name: /Опции/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Добавить отверстие' }))
    expect(screen.getByRole('dialog', { name: 'Отверстие' })).toBeInTheDocument()
  })
  it('keeps the full project material list and carries material into description and spec row', () => {
    render(<R001PrototypePage />)
    const selects = screen.getAllByRole('combobox')
    const material = selects.find((node) => within(node).queryByText('Оцинкованная сталь'))
    expect(material).toBeTruthy()
    const options = within(material as HTMLElement).getAllByRole('option')
    expect(options.length).toBeGreaterThan(2)
    const labels = options.map((option) => option.textContent)
    expect(labels).toContain('Оцинкованная сталь')
    expect(labels).toContain('Нержавеющая 430 техническая')
    expect(labels).toContain('Нержавеющая 304 пищевая')
    expect(labels).not.toContain('Алюминий')

    // выбранный материал попадает в описание позиции
    fireEvent.change(material as HTMLElement, { target: { value: 'Нержавеющая 304 пищевая' } })
    expect(document.querySelector('.r001-spec-description')?.textContent).toContain('Нержавеющая 304 пищевая')

    // и в добавленную строку спецификации (client)
    setState('Рабочий кабинет подключён')
    fireEvent.click(screen.getByRole('button', { name: 'Добавить в проект' }))
    fireEvent.click(screen.getByText(/Спецификация ·/))
    const table = screen.getByRole('table')
    expect(within(table).getByText('Нержавеющая 304 пищевая')).toBeInTheDocument()
  })

})
