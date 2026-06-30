import type { SpecificationProject } from '../types'

export function serializeProject(project: SpecificationProject) {
  return JSON.stringify(project, null, 2)
}

export function deserializeProject(raw: string): unknown {
  return JSON.parse(raw)
}
