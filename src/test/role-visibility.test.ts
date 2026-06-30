import { describe, expect, it } from 'vitest'
import { filterMessagesByRole } from '../domain/messages/messageFilter'

describe('role visibility', () => {
  it('hides debug messages from guest and shows them to admin', () => {
    const messages = [
      {
        id: 'debug-only',
        type: 'debug' as const,
        scope: 'debug' as const,
        titleKey: 'message.debug.title',
        descriptionKey: 'message.debug.title',
        visibleTo: ['admin', 'service'] as const,
      },
      {
        id: 'common',
        type: 'info' as const,
        scope: 'help' as const,
        titleKey: 'message.roundSplit.title',
        descriptionKey: 'message.roundSplit.description',
        visibleTo: ['guest', 'user', 'client', 'admin', 'service'] as const,
      },
    ]

    expect(filterMessagesByRole(messages as never, 'guest').map((item) => item.id)).toEqual(['common'])
    expect(filterMessagesByRole(messages as never, 'admin').map((item) => item.id)).toEqual(['debug-only', 'common'])
  })
})
