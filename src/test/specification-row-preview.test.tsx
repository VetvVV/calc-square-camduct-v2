import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import i18n from '../i18n'
import { SpecTable } from '../components/Specification/SpecTable'
import { createEmptyProject, createSpecificationItem } from '../domain/specification/itemFactory'
import { useAppStore } from '../store/appStore'
import { useProjectStore } from '../store/projectStore'

function openPreview() {
  const previewTrigger = screen.getByRole('button', { name: 'Показать превью позиции 1' })
  fireEvent.mouseEnter(previewTrigger)

  const preview = document.body.querySelector('#spec-row-preview-preview-test-item')
  expect(preview).toBeInTheDocument()

  return preview as HTMLElement
}

describe('specification row preview', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('ru')

    const project = createEmptyProject()
    const item = createSpecificationItem('round-duct')
    item.id = 'preview-test-item'
    item.quantity = 2
    item.parameters = { A: 250, B: 1000, Q: 2 }
    item.options = { material: 'galvanized', thickness: 0.5 }
    item.calculated = { areaRaw: 1.57, areaDisplay: 1.57, massRaw: 6.16, massDisplay: 6.16 }
    item.moduleMetadata = {
      trace: 'diagnostic formula payload',
      moduleKey: 'round-duct',
    }
    project.items = [item]

    useAppStore.setState({ activeModule: 'round-duct', role: 'client', camductMode: false })
    useProjectStore.setState({ project, editingItemId: null, editingDraft: null })
  })

  afterEach(() => {
    cleanup()
  })

  it('renders the public-safe row number preview without changing row actions', () => {
    render(
      <MemoryRouter>
        <SpecTable />
      </MemoryRouter>,
    )

    expect(screen.getByRole('columnheader', { name: 'Наименование' })).toBeInTheDocument()

    const previewTrigger = screen.getByRole('button', { name: 'Показать превью позиции 1' })
    expect(previewTrigger).toBeInTheDocument()
    expect(previewTrigger).toHaveAttribute('aria-describedby', 'spec-row-preview-preview-test-item')

    const preview = openPreview()
    expect(preview).toHaveClass('spec-row-preview-v1')
    expect(preview.querySelector('.product-svg--krg-001')).toBeInTheDocument()
    expect(preview).toHaveTextContent('Позиция №1')
    expect(preview).toHaveTextContent('KRG-001')
    expect(preview).toHaveTextContent('Воздуховод круглый / труба прямошовная')
    expect(preview).toHaveTextContent('D 250 × L 1000 мм')
    expect(preview).toHaveTextContent('Количество')
    expect(preview).toHaveTextContent('Материал')
    expect(preview).toHaveTextContent('Толщина')
    expect(preview).toHaveTextContent('Площадь')
    expect(preview).toHaveTextContent('Масса')
    expect(preview).toHaveTextContent('2')
    expect(preview).toHaveTextContent('Оцинкованная сталь')
    expect(preview).toHaveTextContent('0.5')
    expect(preview).toHaveTextContent(/1[,.]570 м²/)
    expect(preview).toHaveTextContent(/6[,.]16 кг/)

    const previewText = preview?.textContent ?? ''
    expect(previewText).not.toContain('formula')
    expect(previewText).not.toContain('trace')
    expect(previewText).not.toContain('diagnostic')
    expect(previewText).not.toContain('moduleKey')
    expect(previewText).not.toContain('round-duct')

    expect(screen.getByTitle('Edit')).toBeInTheDocument()
    expect(screen.getByTitle('Remove')).toBeInTheDocument()

    fireEvent.mouseLeave(previewTrigger)
    expect(document.body.querySelector('#spec-row-preview-preview-test-item')).not.toBeInTheDocument()
  })

  it('uses the inline PRM-001 visual in the row preview instead of placeholder text', () => {
    const project = createEmptyProject()
    const item = createSpecificationItem('rect-duct')
    item.id = 'preview-test-item'
    item.quantity = 1
    item.parameters = { A: 400, B: 300, L: 1000, Q: 1 }
    item.options = { material: 'galvanized', thickness: 0.5 }
    item.calculated = { areaRaw: 1.436, areaDisplay: 1.436, massRaw: 5.64, massDisplay: 5.64 }
    project.items = [item]

    useAppStore.setState({ activeModule: 'rect-duct', role: 'client', camductMode: false })
    useProjectStore.setState({ project, editingItemId: null, editingDraft: null })

    render(
      <MemoryRouter>
        <SpecTable />
      </MemoryRouter>,
    )

    const preview = openPreview()
    const visual = preview.querySelector('.spec-row-preview-visual-v1')

    expect(visual?.querySelector('.product-svg--prm-001')).toBeInTheDocument()
    expect(visual).not.toHaveTextContent('PRM-001')
    expect(preview).toHaveTextContent('PRM-001')
    expect(preview).toHaveTextContent('Воздуховод прямоугольный')
    expect(preview).toHaveTextContent('W 400 × H 300 × L 1000 мм')
    expect(preview).not.toHaveTextContent('A 400 × B 300')
  })
})
