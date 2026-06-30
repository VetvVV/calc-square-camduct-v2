import type { SpecificationItem, SpecificationProject } from '../../types'
import { migrateProject, normalizeProjectItem } from './itemMigrations'
import { calculateProjectTotals } from './totals'

export function addItem(project: SpecificationProject, item: SpecificationItem): SpecificationProject {
  const nextItems = [...project.items, normalizeProjectItem(item)]

  return withRecalculatedTotals({
    ...project,
    items: nextItems,
    updatedAt: new Date().toISOString(),
  })
}

export function removeItem(project: SpecificationProject, itemId: string): SpecificationProject {
  const nextItems = project.items.filter((item) => item.id !== itemId)

  return withRecalculatedTotals({
    ...project,
    items: nextItems,
    updatedAt: new Date().toISOString(),
  })
}

export function replaceItem(project: SpecificationProject, itemId: string, nextItem: SpecificationItem): SpecificationProject {
  const nextItems = project.items.map((item) => (item.id === itemId ? normalizeProjectItem(nextItem) : item))

  return withRecalculatedTotals({
    ...project,
    items: nextItems,
    updatedAt: new Date().toISOString(),
  })
}

export function withRecalculatedTotals(project: SpecificationProject): SpecificationProject {
  const normalized = migrateProject(project)
  const totals = calculateProjectTotals(normalized.items)

  return {
    ...normalized,
    metadata: {
      ...normalized.metadata,
      totals,
    },
  }
}
