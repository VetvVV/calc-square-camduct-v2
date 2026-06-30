import { migrateProject } from '../domain/specification/itemMigrations'
import type { SpecificationProject } from '../types'

export function migrateImportedProject(project: SpecificationProject) {
  return migrateProject(project)
}
