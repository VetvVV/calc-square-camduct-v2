import { Outlet } from 'react-router-dom'
import { AppPersistence } from '../components/AppPersistence'
import { AppHeader } from '../components/Layout/AppHeader'
import { NavBar } from '../components/Layout/NavBar'

export function App() {
  return (
    <div className="brand-shell min-h-screen text-[var(--brand-ink)]">
      <AppPersistence />
      <AppHeader />
      <NavBar />
      <main className="workspace-v1 mx-auto w-full max-w-[1880px] px-3 py-3 sm:px-4 xl:px-5 2xl:px-6">
        <Outlet />
      </main>
    </div>
  )
}
