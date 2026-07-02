export interface RectangularLockInfo {
  welded: boolean
  lockName: 'american' | 'welded'
  lockLabelKey: 'lock.american' | 'lock.welded'
  Z1: number
  Z2: number
  lockSize: string
  russianLockSize: number
}

export function rectangularLockInfo(length: number, thickness: number): RectangularLockInfo {
  const welded = length <= 200

  if (welded) {
    return {
      welded,
      lockName: 'welded',
      lockLabelKey: 'lock.welded',
      Z1: 15,
      Z2: 0,
      lockSize: '15/0',
      russianLockSize: thickness < 0.9 ? 25 : 28,
    }
  }

  const thin = thickness < 0.9

  return {
    welded,
    lockName: 'american',
    lockLabelKey: 'lock.american',
    Z1: thin ? 6 : 5,
    Z2: thin ? 30 : 28,
    lockSize: thin ? '6/30' : '5/28',
    russianLockSize: thin ? 25 : 28,
  }
}
