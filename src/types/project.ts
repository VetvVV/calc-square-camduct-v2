import type { Message } from './messages'
import type { ModuleKey } from './module'

export interface SpecificationItemCalculated {
  areaRaw: number
  areaDisplay: number
  massRaw: number | null
  massDisplay: number | null
}

export interface SpecificationItem {
  itemSchemaVersion: 1
  id: string
  moduleKey: ModuleKey
  quantity: number
  comment: string
  parameters: Record<string, number | string | boolean | null>
  options: Record<string, number | string | boolean | null>
  calculated: SpecificationItemCalculated
  moduleMetadata: Record<string, unknown>
  displayCache?: Record<string, unknown>
  messages: Message[]
  metadata: {
    createdAt: string
    updatedAt: string
    camductCompatibility: {
      version: string
      status: 'not_checked' | 'draft' | 'ready'
    }
  }
}

export interface ProjectTotals {
  areaTotal: number
  massTotal: number
  itemCount: number
}

export interface SpecificationProject {
  projectSchemaVersion: 1
  id: string
  name: string
  customer: string
  object: string
  createdAt: string
  updatedAt: string
  items: SpecificationItem[]
  metadata?: {
    totals?: ProjectTotals
  }
}
