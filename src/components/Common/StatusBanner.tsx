import { Alert } from './Alert'

interface StatusBannerProps {
  tone?: 'info' | 'warning' | 'error' | 'success'
  title: string
  description?: string
  action?: React.ReactNode
}

export function StatusBanner({ tone = 'info', title, description, action }: StatusBannerProps) {
  return (
    <Alert tone={tone} title={title}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          {description ? <p className="text-sm leading-6">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </Alert>
  )
}
