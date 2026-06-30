import type { Message } from '../../types'
import { useTranslation } from 'react-i18next'
import { Alert } from '../Common/Alert'

interface MessageListProps {
  messages: Message[]
}

function toneFromMessage(type: Message['type']): 'info' | 'warning' | 'error' | 'success' {
  if (type === 'warning') return 'warning'
  if (type === 'error') return 'error'
  if (type === 'success') return 'success'
  return 'info'
}

export function MessageList({ messages }: MessageListProps) {
  const { t } = useTranslation()

  if (messages.length === 0) return null

  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <Alert
          key={message.id}
          tone={toneFromMessage(message.type)}
          title={t(message.titleKey)}
        >
          {t(message.descriptionKey, { ...message.descriptionParams, by: t('split.by') })}
        </Alert>
      ))}
    </div>
  )
}
