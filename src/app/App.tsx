import { Outlet, useLocation } from 'react-router-dom'
import { AppPersistence } from '../components/AppPersistence'
import { AppHeader } from '../components/Layout/AppHeader'
import { NavBar } from '../components/Layout/NavBar'

export function App() {
  const location = useLocation()
  const isSplitWorkspace = location.pathname === '/split'

  const mainClassName = isSplitWorkspace
    ? 'workspace-v1 workspace-v1--split w-full px-2 py-2 sm:px-3'
    : 'workspace-v1 mx-auto w-full max-w-[1880px] px-3 py-3 sm:px-4 xl:px-5 2xl:px-6'

  return (
    <div className="brand-shell min-h-screen text-[var(--brand-ink)]">
      <AppPersistence />
      <AppHeader />
      <NavBar />
      <main className={mainClassName}>
        <Outlet />
      </main>
    </div>
  )
}
