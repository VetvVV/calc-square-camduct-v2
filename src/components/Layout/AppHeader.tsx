import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../store/appStore'
import { CamductToggle } from '../Calculator/CamductToggle'

export function AppHeader() {
  const { t } = useTranslation()
  const role = useAppStore((state) => state.role)
  const setRole = useAppStore((state) => state.setRole)
  const canUseCamduct = role === 'admin' || role === 'service'

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{t('app.title')}</h1>
          <p className="text-sm text-slate-600">{t('app.subtitle')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            aria-label="role"
            value={role}
            onChange={(event) => setRole(event.target.value as typeof role)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
          >
            <option value="guest">guest</option>
            <option value="user">user</option>
            <option value="client">client</option>
            <option value="admin">admin</option>
            <option value="service">service</option>
          </select>

          {canUseCamduct && <CamductToggle />}
        </div>
      </div>
    </header>
  )
}
