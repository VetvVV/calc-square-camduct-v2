import { createEmptyProject } from '../domain/specification/itemFactory'
import { withRecalculatedTotals } from '../domain/specification/specificationManager'
import type { SpecificationProject } from '../types'

const STORAGE_KEY = 'calc-square-camduct-v2.project'

export function saveProjectToStorage(project: SpecificationProject) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(project))
}

export function loadProjectFromStorage(): SpecificationProject {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return createEmptyProject()
  }

  try {
    const parsed = JSON.parse(raw) as SpecificationProject
    return withRecalculatedTotals(parsed)
  } catch {
    return createEmptyProject()
  }
}

export function clearProjectFromStorage() {
  localStorage.removeItem(STORAGE_KEY)
}
