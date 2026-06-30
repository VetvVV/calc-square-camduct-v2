import type { SpecificationItem } from '../../types'

export interface MaterialSummaryEntry {
  material: string
  thickness: number | string
  areaTotal: number
  massTotal: number
  itemCount: number
}

export function calculateMaterialSummary(items: SpecificationItem[]): MaterialSummaryEntry[] {
  const map = new Map<string, MaterialSummaryEntry>()

  for (const item of items) {
    const material = typeof item.options.material === 'string' ? item.options.material : 'unknown'
    const thickness = typeof item.options.thickness === 'number' || typeof item.options.thickness === 'string'
      ? item.options.thickness
      : 'unknown'
    const key = `${material}::${thickness}`

    const current = map.get(key) ?? {
      material,
      thickness,
      areaTotal: 0,
      massTotal: 0,
      itemCount: 0,
    }

    current.areaTotal += item.calculated.areaRaw
    current.massTotal += item.calculated.massRaw ?? 0
    current.itemCount += 1

    map.set(key, current)
  }

  return [...map.values()]
}
