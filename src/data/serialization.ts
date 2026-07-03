import type { SpecificationProject, UserRole } from '../types'
import { sanitizeProjectForRole } from '../security/diagnosticsSanitizer'

export function serializeProject(project: SpecificationProject, role: UserRole = 'guest') {
  return JSON.stringify(sanitizeProjectForRole(project, role), null, 2)
}

export function deserializeProject(raw: string): unknown {
  return JSON.parse(raw)
}
