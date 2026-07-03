import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { SplitLayout } from '../components/Layout/SplitLayout'

describe('workspace split layout foundation', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders named specification and calculator panels without a divider yet', () => {
    const { container } = render(
      <SplitLayout
        left={<div>Specification panel content</div>}
        right={<div>Calculator panel content</div>}
      />,
    )

    expect(container.querySelector('.workspace-split-v1')).toBeInTheDocument()
    expect(container.querySelector('.workspace-split-panel-v1--specification')).toBeInTheDocument()
    expect(container.querySelector('.workspace-split-panel-v1--calculator')).toBeInTheDocument()
    expect(screen.getByText('Specification panel content')).toBeInTheDocument()
    expect(screen.getByText('Calculator panel content')).toBeInTheDocument()
    expect(screen.queryByRole('separator')).not.toBeInTheDocument()
  })
})
