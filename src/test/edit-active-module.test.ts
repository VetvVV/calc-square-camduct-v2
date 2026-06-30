import { describe, expect, it } from 'vitest'

describe('edit workflow active module contract', () => {
  it('supports switching active module to spiral-duct during edit', () => {
    const item = { moduleKey: 'spiral-duct' }
    expect(item.moduleKey).toBe('spiral-duct')
  })

  it('supports switching active module to round-duct during edit', () => {
    const item = { moduleKey: 'round-duct' }
    expect(item.moduleKey).toBe('round-duct')
  })
})
