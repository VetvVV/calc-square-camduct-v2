import type { UserRole } from './user'
import type { MessageScope, MessageType } from './module'

export interface Message {
  id: string
  type: MessageType
  scope: MessageScope
  titleKey: string
  descriptionKey: string
  descriptionParams?: Record<string, string | number | boolean | null>
  visibleTo: UserRole[]
}
