import { describe, expect, it } from 'vitest'
import { filterMessagesByRole } from '../domain/messages/messageFilter'

describe('filterMessagesByRole', () => {
  it('shows debug only for allowed roles', () => {
    const messages = [
      {
        id: 'debug',
        type: 'debug' as const,
        scope: 'debug' as const,
        titleKey: 'message.debug.title',
        descriptionKey: 'message.debug.spiralCalculation',
        visibleTo: ['admin', 'service'] as const,
      },
      {
        id: 'common',
        type: 'info' as const,
        scope: 'help' as const,
        titleKey: 'message.spiralSplit.title',
        descriptionKey: 'message.spiralSplit.description',
        visibleTo: ['guest', 'user', 'client', 'admin', 'service'] as const,
      },
    ]

    expect(filterMessagesByRole(messages as never, 'guest')).toHaveLength(1)
    expect(filterMessagesByRole(messages as never, 'admin')).toHaveLength(2)
  })
})
