export function formatNumber(value: number, fractionDigits = 3) {
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value)
}

export function formatArea(value: number, unit = 'm²') {
  return `${formatNumber(value, 3)} ${unit}`
}

export function formatMass(value: number | null, unit = 'kg') {
  if (value === null) return '—'
  return `${formatNumber(value, 2)} ${unit}`
}

export function formatMillimeters(value: number, unit = 'mm') {
  return `${formatNumber(value, 0)} ${unit}`
}
