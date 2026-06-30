import { Outlet } from 'react-router-dom'
import { AppPersistence } from '../components/AppPersistence'
import { AppHeader } from '../components/Layout/AppHeader'
import { NavBar } from '../components/Layout/NavBar'

export function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AppPersistence />
      <AppHeader />
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
