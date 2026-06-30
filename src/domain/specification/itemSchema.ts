import type { SpecificationItem, SpecificationProject } from '../../types'

export const ITEM_SCHEMA_VERSION = 1 as const
export const PROJECT_SCHEMA_VERSION = 1 as const

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isSpecificationItem(value: unknown): value is SpecificationItem {
  if (!isRecord(value)) return false

  return (
    value.itemSchemaVersion === ITEM_SCHEMA_VERSION &&
    typeof value.id === 'string' &&
    typeof value.moduleKey === 'string' &&
    typeof value.quantity === 'number' &&
    typeof value.comment === 'string' &&
    isRecord(value.parameters) &&
    isRecord(value.options) &&
    isRecord(value.calculated) &&
    Array.isArray(value.messages) &&
    isRecord(value.metadata)
  )
}

export function isSpecificationProject(value: unknown): value is SpecificationProject {
  if (!isRecord(value)) return false

  return (
    value.projectSchemaVersion === PROJECT_SCHEMA_VERSION &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.customer === 'string' &&
    typeof value.object === 'string' &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string' &&
    Array.isArray(value.items)
  )
}
