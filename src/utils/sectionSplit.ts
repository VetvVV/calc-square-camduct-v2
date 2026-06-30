import type { SplitInfo } from '../types'

export function formatSectionsSummary(sections: number[]): string {
  if (sections.length === 0) return ''

  const groups: Array<{ value: number; count: number }> = []

  for (const section of sections) {
    const last = groups[groups.length - 1]
    if (last && last.value === section) {
      last.count += 1
    } else {
      groups.push({ value: section, count: 1 })
    }
  }

  return groups
    .map(({ value, count }) => (count === 1 ? `${value}` : `${count}×${value}`))
    .join('+')
}

export function splitRoundDuct(length: number): SplitInfo {
  const standardSectionLength = 1250

  if (length <= 2000) {
    return {
      splitRequired: false,
      sectionLength: length,
      count: 1,
      sections: [length],
      summary: `${length}`,
      hasRemainder: false,
      remainder: 0,
    }
  }

  const fullCount = Math.floor(length / standardSectionLength)
  const remainder = length % standardSectionLength
  const sections = Array.from({ length: fullCount }, () => standardSectionLength)

  if (remainder > 0) {
    sections.push(remainder)
  }

  return {
    splitRequired: true,
    sectionLength: standardSectionLength,
    count: sections.length,
    sections,
    summary: formatSectionsSummary(sections),
    hasRemainder: remainder > 0,
    remainder,
  }
}

export function splitSpiralDuct(length: number, sectionLength: number): SplitInfo {
  if (length <= sectionLength) {
    return {
      splitRequired: false,
      sectionLength,
      count: 1,
      sections: [length],
      summary: `${length}`,
      hasRemainder: false,
      remainder: 0,
    }
  }

  const fullCount = Math.floor(length / sectionLength)
  const remainder = length % sectionLength
  const sections = Array.from({ length: fullCount }, () => sectionLength)

  if (remainder > 0) {
    sections.push(remainder)
  }

  return {
    splitRequired: true,
    sectionLength,
    count: sections.length,
    sections,
    summary: formatSectionsSummary(sections),
    hasRemainder: remainder > 0,
    remainder,
  }
}
