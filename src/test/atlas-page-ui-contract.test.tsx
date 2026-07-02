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
})
