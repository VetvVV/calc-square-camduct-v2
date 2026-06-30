export function roundTo(value: number, digits: number) {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

export function areaRound3(value: number) {
  return roundTo(value, 3)
}

export function massRound2(value: number | null) {
  if (value === null) return null
  return roundTo(value, 2)
}
