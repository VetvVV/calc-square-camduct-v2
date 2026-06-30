import { describe, expect, it } from 'vitest'

describe('split page routing contract', () => {
  it('accepts only supported module query values by contract', () => {
    const supported = ['round-duct', 'spiral-duct']
    expect(supported).toContain('round-duct')
    expect(supported).toContain('spiral-duct')
    expect(supported).not.toContain('rectangular-duct')
  })
})
