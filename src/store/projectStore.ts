import { create } from 'zustand'
import { createEmptyProject } from '../domain/specification/itemFactory'
import type { SpecificationProject } from '../types'

interface ProjectState {
  project: SpecificationProject
  editingItemId: string | null
  editingDraft: Record<string, unknown> | null
  setProject: (project: SpecificationProject) => void
  setEditingItemId: (itemId: string | null) => void
  setEditingDraft: (draft: Record<string, unknown> | null) => void
}

export const useProjectStore = create<ProjectState>((set) => ({
  project: createEmptyProject(),
  editingItemId: null,
  editingDraft: null,
  setProject: (project) => set({ project }),
  setEditingItemId: (editingItemId) => set({ editingItemId }),
  setEditingDraft: (editingDraft) => set({ editingDraft }),
}))
