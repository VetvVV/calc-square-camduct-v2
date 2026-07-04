export interface R001DemoInput {
  diameter: number
  length: number
  thickness: number
}

export interface R001DemoResult {
  circumference: number
  seamType: string
  allowance: number
  unfoldWidth: number
  area: number
}

export function calculateR001PrototypeDemo({ diameter, length, thickness }: R001DemoInput): R001DemoResult {
  const circumference = Math.PI * diameter
  const shortDuct = length <= 425
  const seamType = shortDuct ? 'точка 3/0' : thickness === 0.9 ? '14/14' : '12.5/12.5'
  const allowance = shortDuct ? 8 : thickness === 0.9 ? 28 : 25
  const unfoldWidth = circumference + allowance
  const area = (length * unfoldWidth) / 1_000_000

  return { circumference, seamType, allowance, unfoldWidth, area }
}
