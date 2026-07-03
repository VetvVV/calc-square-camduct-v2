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

    expect(screen.getAllByText('R-001').length).toBeGreaterThan(0)
    expect(screen.getAllByText('RECT-001').length).toBeGreaterThan(0)
    expect(screen.getAllByText('COMB-001').length).toBeGreaterThan(0)
    expect(container.querySelectorAll('.atlas-grid-v1')).toHaveLength(3)
  })

  it('uses the inline R-001 SVG visual without replacing other Atlas images', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/atlas']}>
        <AtlasPage />
      </MemoryRouter>,
    )

    const r001Visual = container.querySelector('.product-svg.product-svg--r-001')
    expect(r001Visual).toBeInTheDocument()
    expect(r001Visual).toHaveAttribute('viewBox', '0 0 400 300')

    const dimensionsLayer = r001Visual?.querySelector('.p-dims')
    expect(dimensionsLayer).toBeInTheDocument()
    expect(dimensionsLayer).toHaveAttribute('opacity', '0')

    expect(screen.getByAltText('Труба спирально-навивная')).toBeInTheDocument()
    expect(screen.getByAltText('Отвод 45°')).toBeInTheDocument()
  })

  it('uses the inline RECT-001 SVG visual instead of the Atlas placeholder', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/atlas']}>
        <AtlasPage />
      </MemoryRouter>,
    )

    const rect001Visual = container.querySelector('.product-svg.product-svg--rect-001')
    expect(rect001Visual).toBeInTheDocument()
    expect(rect001Visual).toHaveAttribute('viewBox', '0 0 400 300')
    expect(rect001Visual).toHaveAccessibleName('RECT-001 Прямоугольный воздуховод')

    const rect001Card = screen.getByRole('link', { name: /Открыть расчёт: Прямоугольный воздуховод/i })
    expect(rect001Card.querySelector('.atlas-placeholder-v1')).not.toBeInTheDocument()
  })
})
