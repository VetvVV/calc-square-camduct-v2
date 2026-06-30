import { create } from 'zustand'
import type { ModuleKey, UserRole } from '../types'

interface AppState {
  activeModule: ModuleKey
  role: UserRole
  camductMode: boolean
  setActiveModule: (moduleKey: ModuleKey) => void
  setRole: (role: UserRole) => void
  toggleCamductMode: () => void
}

export const useAppStore = create<AppState>((set) => ({
  activeModule: 'round-duct',
  role: 'guest',
  camductMode: false,
  setActiveModule: (activeModule) => set({ activeModule }),
  setRole: (role) => set({ role }),
  toggleCamductMode: () => set((state) => ({ camductMode: !state.camductMode })),
}))
