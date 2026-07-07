import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { AtlasPage } from '../pages/AtlasPage'
import i18n from '../i18n'

describe('Atlas page UI contract', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('ru')
  })

  afterEach(() => {
    cleanup()
  })

  it('shows all category sections and cards without query tabs', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/atlas']}>
        <AtlasPage />
      </MemoryRouter>,
    )

    expect(container.querySelector('.atlas-tabs-v1')).not.toBeInTheDocument()

    expect(container.querySelector('#atlas-round')).toBeInTheDocument()
    expect(container.querySelector('#atlas-rectangular')).toBeInTheDocument()
    expect(container.querySelector('#atlas-combined')).toBeInTheDocument()

    expect(screen.getByText('Круглые изделия')).toBeInTheDocument()
    expect(screen.getByText('Прямоугольные изделия')).toBeInTheDocument()
    expect(screen.getByText('Комбинированные изделия')).toBeInTheDocument()

    expect(screen.getAllByText('KRG-001').length).toBeGreaterThan(0)
    expect(screen.getAllByText('PRM-001').length).toBeGreaterThan(0)
    expect(screen.getAllByText('KMB-001').length).toBeGreaterThan(0)
    expect(container.querySelectorAll('.atlas-grid-v1')).toHaveLength(3)
  })

  it('uses the inline KRG-001 SVG visual without replacing other Atlas images', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/atlas']}>
        <AtlasPage />
      </MemoryRouter>,
    )

    const r001Visual = container.querySelector('.product-svg.product-svg--krg-001')
    expect(r001Visual).toBeInTheDocument()
    expect(r001Visual).toHaveAttribute('viewBox', '0 0 400 300')

    const dimensionsLayer = r001Visual?.querySelector('.p-dims')
    expect(dimensionsLayer).toBeInTheDocument()
    expect(dimensionsLayer).toHaveAttribute('opacity', '0')

    expect(screen.getByAltText('Отвод круглый')).toBeInTheDocument()
  })

  it('uses the inline R-sp-001 SVG visual in the Atlas card', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/atlas']}>
        <AtlasPage />
      </MemoryRouter>,
    )

    const rsp001Visual = container.querySelector('.product-svg.product-svg--rsp-001')
    expect(rsp001Visual).toBeInTheDocument()
    expect(rsp001Visual).toHaveAttribute('viewBox', '0 0 400 300')
    expect(rsp001Visual).toHaveAccessibleName('R-sp-001 Труба спирально-навивная')

    const dimensionsLayer = rsp001Visual?.querySelector('.p-dims')
    expect(dimensionsLayer).toBeInTheDocument()
    expect(dimensionsLayer).toHaveAttribute('opacity', '0')
  })

  it('uses the inline PRM-001 SVG visual instead of the Atlas placeholder', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/atlas']}>
        <AtlasPage />
      </MemoryRouter>,
    )

    const rect001Visual = container.querySelector('.product-svg.product-svg--prm-001')
    expect(rect001Visual).toBeInTheDocument()
    expect(rect001Visual).toHaveAttribute('viewBox', '0 0 400 300')
    expect(rect001Visual).toHaveAccessibleName('PRM-001 Воздуховод прямоугольный')

    const rect001Card = screen.getByRole('link', { name: /Открыть расчёт: Воздуховод прямоугольный/i })
    expect(rect001Card.querySelector('.atlas-placeholder-v1')).not.toBeInTheDocument()
  })
})
