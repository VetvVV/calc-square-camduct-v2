import type { SpecificationItem, SpecificationProject } from '../../types'
import { ITEM_SCHEMA_VERSION, PROJECT_SCHEMA_VERSION } from './itemSchema'

export function normalizeProjectItem(item: SpecificationItem): SpecificationItem {
  return {
    ...item,
    itemSchemaVersion: ITEM_SCHEMA_VERSION,
    quantity: Number.isFinite(item.quantity) ? item.quantity : 1,
    comment: item.comment ?? '',
    parameters: item.parameters ?? {},
    options: item.options ?? {},
    calculated: {
      areaRaw: item.calculated?.areaRaw ?? 0,
      areaDisplay: item.calculated?.areaDisplay ?? 0,
      massRaw: item.calculated?.massRaw ?? null,
      massDisplay: item.calculated?.massDisplay ?? null,
    },
    moduleMetadata: item.moduleMetadata ?? {},
    messages: Array.isArray(item.messages) ? item.messages : [],
    metadata: item.metadata ?? {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      camductCompatibility: {
        version: '1.0',
        status: 'not_checked',
      },
    },
  }
}

export function validateProjectItem(item: unknown): item is SpecificationItem {
  return typeof item === 'object' && item !== null && 'moduleKey' in item && 'parameters' in item
}

export function migrateProject(project: SpecificationProject): SpecificationProject {
  return {
    ...project,
    projectSchemaVersion: PROJECT_SCHEMA_VERSION,
    items: project.items.map(normalizeProjectItem),
  }
}
