import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import { CamductToggle } from '../Calculator/CamductToggle'
import { canViewCamductMode } from '../../roles/permissions'

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path}`

const languageOptions = [
  { code: 'ru', short: 'RU', label: 'Русский' },
  { code: 'uk', short: 'UK', label: 'Українська' },
  { code: 'en', short: 'EN', label: 'English' },
] as const

const roleAccessLabels = {
  guest: 'Ознакомительный расчёт',
  user: 'Ознакомительный доступ',
  client: 'Рабочий кабинет подключён',
  admin: 'Администрирование',
  service: 'Администрирование',
} as const

export function AppHeader() {
  const { i18n, t } = useTranslation()
  const role = useAppStore((state) => state.role)
  const setRole = useAppStore((state) => state.setRole)
  const canUseCamduct = canViewCamductMode(role)
  const [languageOpen, setLanguageOpen] = useState(false)
  const location = useLocation()
  const splitModule = new URLSearchParams(location.search).get('module')
  const isR001Route = location.pathname.includes('/prototype/r001') || (location.pathname === '/split' && splitModule === 'round-duct')
  const currentLanguage = languageOptions.find((option) => option.code === i18n.language) ?? languageOptions[0]
  const accessLabel = roleAccessLabels[role]

  return (
    <header className="brand-topbar sticky top-0 z-30">
      <div className="brand-container flex min-h-[56px] flex-col gap-2 py-1.5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <img src={assetPath('assets/logos/stspecmontazh-logo-dark.png')} alt="ST Spetsmontazh" className="brand-logo-st" />
          <div className="hidden h-8 w-px bg-slate-200 sm:block" />
          <div className="min-w-0 leading-none">
            <div className="brand-title text-lg leading-none sm:text-xl">Calc Square</div>
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
          <span className="brand-access-badge" aria-label="Режим доступа">{accessLabel}</span>

          {isR001Route ? (
            <span className="brand-language-static" aria-label="Текущий язык">RU</span>
          ) : (
          <div
            className="brand-language-select"
            onBlur={(event) => {
              if (!event.relatedTarget || !event.currentTarget.contains(event.relatedTarget as Node)) {
                setLanguageOpen(false)
              }
            }}
          >
            <button
              type="button"
              className="brand-language-trigger"
              aria-haspopup="listbox"
              aria-expanded={languageOpen}
              onClick={() => setLanguageOpen((open) => !open)}
            >
              {currentLanguage.short}
            </button>
            {languageOpen ? (
              <div className="brand-language-menu" role="listbox" aria-label="Language">
                {languageOptions.map((option) => (
                  <button
                    key={option.code}
                    type="button"
                    role="option"
                    aria-selected={i18n.language === option.code}
                    className={['brand-language-option', i18n.language === option.code ? 'is-active' : ''].join(' ')}
                    onClick={() => {
                      void i18n.changeLanguage(option.code)
                      setLanguageOpen(false)
                    }}
                  >
                    <span>{option.short}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          )}

          {canUseCamduct && <CamductToggle />}
        </div>
      </div>
    </header>
  )
}

