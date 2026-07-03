import type { Message, ModuleCalculationOutput, SpecificationItem, SpecificationProject, UserRole } from '../types'

const protectedRoles = new Set<UserRole>(['admin', 'service'])

const protectedDiagnosticKeys = new Set([
  'trace',
  'formulaKey',
  'steps',
  'rectangularDuct',
  'roundSections',
  'spiralSections',
  'lockAllowance',
  'calculatedLength',
  'welded',
  'internalJointType',
  'stripWidth',
  'stripWidthStatus',
  'spiralLockEdges',
  'spiralLockSeam',
  'effectiveStripWidth',
  'effectiveStripWidthMm',
  'stripConsumption',
  'stripConsumptionMm',
  'layout',
  'parts',
  'mainArea',
  'russianArea',
  'lockArea',
  'Z1',
  'Z2',
  'russianLockSize',
  'sheet',
  'cleanArea',
  'perimeter',
])

export function canKeepProtectedDiagnostics(role: UserRole) {
  return protectedRoles.has(role)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function sanitizeDiagnosticValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitizeDiagnosticValue)
  }

  if (!isRecord(value)) {
    return value
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !protectedDiagnosticKeys.has(key))
      .map(([key, entry]) => [key, sanitizeDiagnosticValue(entry)]),
  )
}

function sanitizeMessages(messages?: Message[] | null) {
  if (!messages) return []
  return messages.filter((message) => message.type !== 'debug' && message.scope !== 'debug')
}

export function sanitizeCalculationOutputForRole(output: ModuleCalculationOutput, role: UserRole): ModuleCalculationOutput {
  if (canKeepProtectedDiagnostics(role)) {
    return output
  }

  return sanitizeDiagnosticValue({
    calculated: {
      areaRaw: output.calculated.areaRaw,
      areaDisplay: output.calculated.areaDisplay,
      massRaw: output.calculated.massRaw,
      massDisplay: output.calculated.massDisplay,
      splitInfo: output.calculated.splitInfo,
    },
    splitInfo: output.splitInfo,
    moduleMetadata: sanitizeDiagnosticValue(output.moduleMetadata) as Record<string, unknown>,
    messages: sanitizeMessages(output.messages),
  }) as ModuleCalculationOutput
}

export function sanitizeSpecificationItemForRole(item: SpecificationItem, role: UserRole): SpecificationItem {
  if (canKeepProtectedDiagnostics(role)) {
    return item
  }

  const publicSafeItem = {
    ...item,
    calculated: {
      areaRaw: item.calculated.areaRaw,
      areaDisplay: item.calculated.areaDisplay,
      massRaw: item.calculated.massRaw,
      massDisplay: item.calculated.massDisplay,
    },
    moduleMetadata: sanitizeDiagnosticValue(item.moduleMetadata) as Record<string, unknown>,
    displayCache: isRecord(item.displayCache) ? sanitizeDiagnosticValue(item.displayCache) as Record<string, unknown> : item.displayCache,
    messages: sanitizeMessages(item.messages),
  }

  return sanitizeDiagnosticValue(publicSafeItem) as SpecificationItem
}

export function sanitizeProjectForRole(project: SpecificationProject, role: UserRole): SpecificationProject {
  if (canKeepProtectedDiagnostics(role)) {
    return project
  }

  const publicSafeProject = {
    ...project,
    items: project.items.map((item) => sanitizeSpecificationItemForRole(item, role)),
  }

  return sanitizeDiagnosticValue(publicSafeProject) as SpecificationProject
}
