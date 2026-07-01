import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../store/appStore'
import { canViewSpecification } from '../../roles/permissions'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  ['brand-nav-link px-2.5 py-1.5 transition-colors', isActive ? 'is-active' : ''].join(' ')

export function NavBar() {
  const { t } = useTranslation()
  const role = useAppStore((state) => state.role)
  const showProjectNavigation = canViewSpecification(role)

  return (
    <div className="border-b border-slate-200 bg-white/75">
      <div className="brand-container flex min-h-9 items-center">
        <nav className="flex flex-wrap items-center gap-5">
          <NavLink to="/" className={linkClass} end>
            {t('nav.home')}
          </NavLink>
          <NavLink to="/atlas" className={linkClass}>
            {t('nav.atlas')}
          </NavLink>
          {showProjectNavigation ? (
            <>
              <NavLink to="/split" className={linkClass}>
                {t('nav.split')}
              </NavLink>
              <NavLink to="/specification" className={linkClass}>
                {t('nav.specification')}
              </NavLink>
            </>
          ) : null}
        </nav>
      </div>
    </div>
  )
}
