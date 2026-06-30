import type { Message, UserRole } from '../../types'
import { canViewDebugPanel } from '../../roles/permissions'

export function filterMessagesByRole(messages: Message[], role: UserRole) {
  return messages.filter((message) => {
    if (message.scope === 'debug' || message.type === 'debug') {
      return canViewDebugPanel(role)
    }
    return message.visibleTo.includes(role)
  })
}
