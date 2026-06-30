import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../store/appStore'
import { CamductToggle } from '../Calculator/CamductToggle'
import { canViewCamductMode } from '../../roles/permissions'

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path}`

export function AppHeader() {
  const { i18n, t } = useTranslation()
  const role = useAppStore((state) => state.role)
  const setRole = useAppStore((state) => state.setRole)
  const canUseCamduct = canViewCamductMode(role)

  return (
    <header className="brand-topbar sticky top-0 z-30">
      <div className="brand-container flex min-h-[56px] flex-col gap-2 py-1.5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <img src={assetPath('assets/logos/stspecmontazh-logo-dark.png')} alt="ST Spetsmontazh" className="brand-logo-st" />
          <div className="hidden h-8 w-px bg-slate-200 sm:block" />
          <div className="min-w-0 leading-none">
            <div className="brand-title text-lg leading-none sm:text-xl">Calc Square</div>
            <div className="mt-0.5 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[var(--brand-accent)]">CAMduct V2</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-end">
          <select
            aria-label="role"
            value={role}
            onChange={(event) => setRole(event.target.value as typeof role)}
            className="brand-select h-8 px-2"
          >
            <option value="guest">{t('role.guest')}</option>
            <option value="user">{t('role.user')}</option>
            <option value="client">{t('role.client')}</option>
            <option value="admin">{t('role.admin')}</option>
            <option value="service">{t('role.service')}</option>
          </select>

          <div className="flex items-center gap-1">
            {['ru', 'uk', 'en'].map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => void i18n.changeLanguage(lang)}
                className={['brand-lang-button px-3 py-1', i18n.language === lang ? 'is-active' : ''].join(' ')}
              >
                {lang}
              </button>
            ))}
          </div>

          {canUseCamduct && <CamductToggle />}
        </div>
      </div>
    </header>
  )
}

