import type { ModuleKey, SpecificationItem, SpecificationProject } from '../../types'
import { createId } from '../../utils/ids'
import { ITEM_SCHEMA_VERSION, PROJECT_SCHEMA_VERSION } from './itemSchema'

export function createEmptyProject(): SpecificationProject {
  const now = new Date().toISOString()

  return {
    projectSchemaVersion: PROJECT_SCHEMA_VERSION,
    id: createId('project'),
    name: 'New project',
    customer: '',
    object: '',
    createdAt: now,
    updatedAt: now,
    items: [],
    metadata: {
      totals: {
        areaTotal: 0,
        massTotal: 0,
        itemCount: 0,
      },
    },
  }
}

export function createSpecificationItem(moduleKey: ModuleKey): SpecificationItem {
  const now = new Date().toISOString()

  return {
    itemSchemaVersion: ITEM_SCHEMA_VERSION,
    id: createId('item'),
    moduleKey,
    quantity: 1,
    comment: '',
    parameters: {},
    options: {},
    calculated: {
      areaRaw: 0,
      areaDisplay: 0,
      massRaw: null,
      massDisplay: null,
    },
    moduleMetadata: {},
    messages: [],
    metadata: {
      createdAt: now,
      updatedAt: now,
      camductCompatibility: {
        version: '1.0',
        status: 'not_checked',
      },
    },
  }
}
