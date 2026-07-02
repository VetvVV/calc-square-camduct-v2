import type { ModuleCalculationOutput } from '../../types'
import { RECTANGULAR_SHEET_LENGTH, RECTANGULAR_SHEET_WIDTH } from '../sheet'
import { rectangularLockInfo } from '../locks'
import { areaRound3, massRound2 } from './base'
import { createFormulaTrace } from './formulaTrace'

export interface RectDuctInput {
  A: number
  B: number
  L: number
  T?: number | null
  Q?: number
}

export interface RectDuctLayoutInfo {
  perimeter: number
  cleanArea: number
  parts: 1 | 2 | 4
  layout: 'ABAB' | 'ABA + B' | 'AB + AB' | 'A + B + A + B'
  russianLocks: number
  mainArea: number
  russianArea: number
  lockArea: number
  welded: boolean
  lockName: 'american' | 'welded'
  lockLabelKey: 'lock.american' | 'lock.welded'
  lockSize: string
  Z1: number
  Z2: number
  russianLockSize: number
  sheet: {
    width: number
    length: number
  }
}

export function calculateRectDuct(input: RectDuctInput): ModuleCalculationOutput {
  const A = input.A
  const B = input.B
  const L = input.L
  const Q = input.Q ?? 1
  const T = typeof input.T === 'number' ? input.T : 0.5
  const perimeter = 2 * (A + B)
  const cleanArea = (perimeter * L * Q) / 1_000_000
  const lock = rectangularLockInfo(L, T)

  const fitABAB =
    (perimeter <= RECTANGULAR_SHEET_WIDTH && L <= RECTANGULAR_SHEET_LENGTH) ||
    (perimeter <= RECTANGULAR_SHEET_LENGTH && L <= RECTANGULAR_SHEET_WIDTH)

  const fitABA =
    (A + B + A <= RECTANGULAR_SHEET_WIDTH && L <= RECTANGULAR_SHEET_LENGTH) ||
    (A + B + A <= RECTANGULAR_SHEET_LENGTH && L <= RECTANGULAR_SHEET_WIDTH)

  const fitAB =
    (A + B <= RECTANGULAR_SHEET_WIDTH && L <= RECTANGULAR_SHEET_LENGTH) ||
    (A + B <= RECTANGULAR_SHEET_LENGTH && L <= RECTANGULAR_SHEET_WIDTH)

  let parts: RectDuctLayoutInfo['parts'] = 4
  let layout: RectDuctLayoutInfo['layout'] = 'A + B + A + B'

  if (fitABAB) {
    parts = 1
    layout = 'ABAB'
  } else if (fitABA && L <= RECTANGULAR_SHEET_LENGTH) {
    parts = 2
    layout = 'ABA + B'
  } else if (fitAB && L <= RECTANGULAR_SHEET_LENGTH) {
    parts = 2
    layout = 'AB + AB'
  }

  let russianLocks = 0
  if (parts === 2 && L > RECTANGULAR_SHEET_LENGTH) {
    russianLocks = 2
  } else if (parts === 4) {
    if (A > RECTANGULAR_SHEET_WIDTH) russianLocks += 2
    if (B > RECTANGULAR_SHEET_WIDTH) russianLocks += 2
  }

  const mainArea = (parts * (lock.Z1 + lock.Z2) * L * Q) / 1_000_000
  const russianArea = (russianLocks * lock.russianLockSize * perimeter * Q) / 1_000_000
  const lockArea = mainArea + russianArea
  const areaRaw = cleanArea + lockArea
  const massRaw = areaRaw * (T / 1000) * 7850

  const layoutInfo: RectDuctLayoutInfo = {
    perimeter,
    cleanArea,
    parts,
    layout,
    russianLocks,
    mainArea,
    russianArea,
    lockArea,
    welded: lock.welded,
    lockName: lock.lockName,
    lockLabelKey: lock.lockLabelKey,
    lockSize: lock.lockSize,
    Z1: lock.Z1,
    Z2: lock.Z2,
    russianLockSize: lock.russianLockSize,
    sheet: {
      width: RECTANGULAR_SHEET_WIDTH,
      length: RECTANGULAR_SHEET_LENGTH,
    },
  }

  return {
    calculated: {
      areaRaw,
      areaDisplay: areaRound3(areaRaw),
      massRaw,
      massDisplay: massRound2(massRaw),
      trace: createFormulaTrace('rect-duct.area', [
        { label: 'A', value: A },
        { label: 'B', value: B },
        { label: 'L', value: L },
        { label: 'Q', value: Q },
        { label: 'T', value: T },
        { label: 'P', value: perimeter },
        { label: 'Layout', value: layout },
        { label: 'Parts', value: parts },
        { label: 'Lock', value: `${lock.Z1}/${lock.Z2}` },
        { label: 'Russian locks', value: russianLocks },
        { label: 'Area raw', value: areaRaw },
      ]),
    },
    moduleMetadata: {
      rectangularDuct: layoutInfo,
    },
    messages: [],
    trace: createFormulaTrace('rect-duct.area', [
      { label: 'A', value: A },
      { label: 'B', value: B },
      { label: 'L', value: L },
      { label: 'Q', value: Q },
      { label: 'T', value: T },
      { label: 'Clean area', value: cleanArea },
      { label: 'Lock area', value: lockArea },
      { label: 'Mass raw', value: massRaw },
    ]),
  }
}
