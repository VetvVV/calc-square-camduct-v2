import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100',
  ].join(' ')

export function NavBar() {
  const { t, i18n } = useTranslation()

  return (
    <div className="border-b border-slate-200 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <nav className="flex flex-wrap gap-2">
          <NavLink to="/" className={linkClass} end>
            {t('nav.home')}
          </NavLink>
          <NavLink to="/atlas" className={linkClass}>
            {t('nav.atlas')}
          </NavLink>
          <NavLink to="/split" className={linkClass}>
            {t('nav.split')}
          </NavLink>
          <NavLink to="/specification" className={linkClass}>
            {t('nav.specification')}
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          {['ru', 'uk', 'en'].map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => void i18n.changeLanguage(lang)}
              className={[
                'rounded-md border px-3 py-1.5 text-sm uppercase',
                i18n.language === lang
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-300 bg-white text-slate-700',
              ].join(' ')}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
