import type { SpecificationProject } from '../types'

export function validateProjectForExport(project: SpecificationProject) {
  const issues: string[] = []

  if (!project.items.length) {
    issues.push('Project contains no items')
  }

  for (const item of project.items) {
    if (!item.moduleKey) {
      issues.push(`Item ${item.id} has no moduleKey`)
    }
    if (!item.parameters) {
      issues.push(`Item ${item.id} has no parameters`)
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  }
}
