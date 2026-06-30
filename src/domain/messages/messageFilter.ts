import type { Message, UserRole } from '../../types'

export function filterMessagesByRole(messages: Message[], role: UserRole) {
  return messages.filter((message) => message.visibleTo.includes(role))
}
