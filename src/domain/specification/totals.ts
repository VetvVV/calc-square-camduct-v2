import type { ProjectTotals, SpecificationItem } from '../../types'

export function calculateProjectTotals(items: SpecificationItem[]): ProjectTotals {
  return items.reduce<ProjectTotals>(
    (acc, item) => {
      acc.areaTotal += item.calculated.areaRaw
      acc.massTotal += item.calculated.massRaw ?? 0
      acc.itemCount += 1
      return acc
    },
    {
      areaTotal: 0,
      massTotal: 0,
      itemCount: 0,
    },
  )
}
