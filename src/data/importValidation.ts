import { isSpecificationProject } from '../domain/specification/itemSchema'

const supportedModules = new Set(['round-duct', 'spiral-duct', 'rect-duct'])

export function validateImportedProject(data: unknown) {
  if (!isSpecificationProject(data)) {
    return {
      valid: false,
      issues: ['Invalid project schema'],
    }
  }

  const issues: string[] = []

  for (const item of data.items) {
    if (!supportedModules.has(item.moduleKey)) {
      issues.push(`Unsupported moduleKey: ${item.moduleKey}`)
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  }
}

