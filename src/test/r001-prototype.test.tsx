import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { R001PrototypePage } from '../pages/R001PrototypePage'
import { calculateR001PrototypeDemo } from '../prototypes/r001DemoEngine'

describe('R-001 public/service prototype', () => {
  afterEach(() => {
    cleanup()
  })

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
    expect(result.allowance).toBe(25)
    expect(result.unfoldWidth).toBeCloseTo(417.699, 3)
    expect(result.area).toBeCloseTo(0.418, 3)
  })

  it('calculates the long 0.9 mm russian lock demo case', () => {
    const result = calculateR001PrototypeDemo({ diameter: 125, length: 1000, thickness: 0.9 })

    expect(result.seamType).toBe('14/14')
    expect(result.allowance).toBe(28)
    expect(result.unfoldWidth).toBeCloseTo(420.699, 3)
    expect(result.area).toBeCloseTo(0.421, 3)
  })

  it('keeps the public wrapper free of CAMduct service fields and adds a public hole', () => {
    render(<R001PrototypePage />)

    expect(screen.getByRole('heading', { name: 'Труба прямошовная' })).toBeInTheDocument()
    expect(screen.getByLabelText('Схема трубы прямошовной')).toHaveTextContent('ØD 125')
    expect(screen.getByLabelText('Схема трубы прямошовной')).toHaveTextContent('L 1000')
    expect(screen.queryByText('S1')).not.toBeInTheDocument()
    expect(screen.queryByText('C1')).not.toBeInTheDocument()
    expect(screen.queryByText('точка 3/0')).not.toBeInTheDocument()
    expect(screen.queryByText('12.5/12.5')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Добавить отверстие' }))
    const dialog = screen.getByRole('dialog', { name: 'Отверстие' })
    fireEvent.change(within(dialog).getByLabelText('Форма отверстия'), { target: { value: 'rectangular' } })
    fireEvent.change(within(dialog).getByLabelText('Размер 1, мм'), { target: { value: '200' } })
    fireEvent.change(within(dialog).getByLabelText('Размер 2, мм'), { target: { value: '100' } })
    fireEvent.change(within(dialog).getByLabelText('Сторона'), { target: { value: 'top' } })
    fireEvent.change(within(dialog).getByLabelText('Положение по длине, мм'), { target: { value: '500' } })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Добавить' }))

    expect(screen.getAllByText('Отверстий: 1')).toHaveLength(2)
    expect(screen.getByRole('table')).toHaveTextContent('Отверстий: 1')
    expect(screen.queryByText('S1')).not.toBeInTheDocument()
  })

  it('shows the service CAMduct-like hole dialog and diagnostics in Service ON', () => {
    render(<R001PrototypePage />)

    fireEvent.click(screen.getByRole('button', { name: 'Service ON' }))

    expect(screen.getByLabelText('Service diagnostics')).toHaveTextContent('S1 = 12.5/12.5')
    expect(screen.getByLabelText('Service diagnostics')).toHaveTextContent('allowance = 25 мм')

    fireEvent.click(screen.getByRole('button', { name: 'Отверстие' }))
    const dialog = screen.getByRole('dialog', { name: 'Отверстие' })

    expect(within(dialog).getByLabelText('Выбор стороны')).toBeInTheDocument()
    expect(within(dialog).getByRole('option', { name: 'Верх' })).toBeInTheDocument()
    expect(within(dialog).getByRole('option', { name: 'Низ' })).toBeInTheDocument()
    expect(within(dialog).getByRole('option', { name: 'Лево' })).toBeInTheDocument()
    expect(within(dialog).getByRole('option', { name: 'Право' })).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Да' })).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Отменить' })).toBeInTheDocument()
  })
})
