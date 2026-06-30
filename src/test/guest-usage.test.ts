import { beforeEach, describe, expect, it } from 'vitest'
import { clearGuestUsage, getGuestUsageLimitState, incrementGuestUsage } from '../utils/guestUsage'

describe('guest usage limit', () => {
  beforeEach(() => {
    localStorage.clear()
    clearGuestUsage()
  })

  it('tracks guest usage and exposes exhausted state', () => {
    for (let index = 0; index < 5; index += 1) {
      incrementGuestUsage()
    }

    const state = getGuestUsageLimitState()
    expect(state.count).toBe(5)
    expect(state.remaining).toBe(0)
    expect(state.exhausted).toBe(true)
  })
})
