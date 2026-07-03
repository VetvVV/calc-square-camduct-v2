import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
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

    unmount()
    renderSplit('/split?module=spiral-duct')
    expect(screen.getByText('R-sp-001 / Спирально-навивная труба')).toBeInTheDocument()
  })
})
