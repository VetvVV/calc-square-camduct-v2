import { Outlet } from 'react-router-dom'
import { AppPersistence } from '../components/AppPersistence'
import { AppHeader } from '../components/Layout/AppHeader'
import { NavBar } from '../components/Layout/NavBar'
import { BUILD_INFO } from '../build-info'

function BuildBadge() {
  const hash = BUILD_INFO.commitHash === 'local' ? '' : ` · ${BUILD_INFO.commitHash}`

  return (
    <div className="build-badge-v1">
      v{BUILD_INFO.version} {BUILD_INFO.label} · build {BUILD_INFO.buildDateTime}{hash}
    </div>
  )
}

export function App() {
  return (
    <div className="brand-shell min-h-screen text-[var(--brand-ink)]">
      <AppPersistence />
      <AppHeader />
      <NavBar />
      <main className="workspace-v1 mx-auto w-full max-w-[1880px] px-3 py-3 sm:px-4 xl:px-5 2xl:px-6">
        <Outlet />
      </main>
      <BuildBadge />
    </div>
  )
}
