export type CamductCheckStatus = 'confirmed' | 'baseline' | 'mismatch' | 'pending'

export type CamductExpectedSource = 'engine-baseline' | 'camduct'

export interface CamductCheck {
  id: string
  productCode: string
  productTitle: string
  category: string
  formulaKey: string
  calculatorKey: string
  inputs: Record<string, string | number | boolean | null>
  expectedResult: number | null
  resultUnit: string
  expectedSource: CamductExpectedSource | null
  toleranceAbs?: number
  tolerancePct?: number
  camductVersion?: string
  checkedAt?: string
  evidenceRef?: string
  screenshotRef?: string
  status: CamductCheckStatus
  scope: string
  testRef?: string
  formulaCardRef?: string
  comment?: string
}

export type CamductDiffStatus = 'within-tolerance' | 'outside-tolerance' | 'pending'

export interface CamductDiffResult {
  status: CamductDiffStatus
  expectedResult: number | null
  actualResult: number
  diffAbs: number | null
  diffPct: number | null
  withinTolerance: boolean | null
  skipped: boolean
}

export function camductDiff(check: CamductCheck, actualResult: number): CamductDiffResult {
  if (check.expectedResult === null) {
    return {
      status: 'pending',
      expectedResult: null,
      actualResult,
      diffAbs: null,
      diffPct: null,
      withinTolerance: null,
      skipped: true,
    }
  }

  const diffAbs = Math.abs(actualResult - check.expectedResult)
  const diffPct = check.expectedResult === 0 ? null : (diffAbs / Math.abs(check.expectedResult)) * 100

  const absWithinTolerance =
    typeof check.toleranceAbs === 'number' ? diffAbs <= check.toleranceAbs : null
  const pctWithinTolerance =
    typeof check.tolerancePct === 'number' && diffPct !== null ? diffPct <= check.tolerancePct : null
  const withinTolerance =
    absWithinTolerance === true ||
    pctWithinTolerance === true ||
    (absWithinTolerance === null && pctWithinTolerance === null && diffAbs === 0)

  return {
    status: withinTolerance ? 'within-tolerance' : 'outside-tolerance',
    expectedResult: check.expectedResult,
    actualResult,
    diffAbs,
    diffPct,
    withinTolerance,
    skipped: false,
  }
}

export const camductChecks: CamductCheck[] = [
  {
    id: 'KRG-001-round-duct-A250-B1000-baseline',
    productCode: 'KRG-001',
    productTitle: 'Воздуховод круглый / труба прямошовная',
    category: 'round',
    formulaKey: 'KRG-001',
    calculatorKey: 'round-duct',
    inputs: { A: 250, B: 1000, quantity: 1, C1: 'none', C2: 'none' },
    expectedResult: 0.81,
    resultUnit: 'm2',
    expectedSource: 'engine-baseline',
    toleranceAbs: 0.001,
    status: 'baseline',
    scope: 'areaDisplay',
    testRef: 'src/test/round-duct.test.ts',
    formulaCardRef: 'KRG-001',
    comment:
      'Baseline from current engine/unit test only. Not a CAMduct confirmation. Owner-approved S1 rule: Lрасч <= 449 -> 8 мм; Lрасч >= 450 and t=0.5/0.7 -> 25 мм; Lрасч >= 450 and t=0.9 -> 28 мм.',
  },
  {
    id: 'KRG-001-round-duct-A250-B3200-split-baseline',
    productCode: 'KRG-001',
    productTitle: 'Воздуховод круглый / труба прямошовная',
    category: 'round',
    formulaKey: 'KRG-001',
    calculatorKey: 'round-duct',
    inputs: { A: 250, B: 3200, quantity: 1, C1: 'none', C2: 'none' },
    expectedResult: 2.593,
    resultUnit: 'm2',
    expectedSource: 'engine-baseline',
    toleranceAbs: 0.001,
    status: 'baseline',
    scope: 'areaDisplay+split',
    testRef: 'src/test/round-duct.test.ts',
    formulaCardRef: 'KRG-001',
    comment: 'Baseline from current engine/unit test only. Split summary in test: 2x1250+700.',
  },
  {
    id: 'PRM-001-rect-duct-A400-B300-L1000-baseline',
    productCode: 'PRM-001',
    productTitle: 'Воздуховод прямоугольный',
    category: 'rectangular',
    formulaKey: 'PRM-001',
    calculatorKey: 'rect-duct',
    inputs: { A: 400, B: 300, L: 1000, T: 0.5, Q: 1 },
    expectedResult: 1.436,
    resultUnit: 'm2',
    expectedSource: 'engine-baseline',
    toleranceAbs: 0.001,
    status: 'baseline',
    scope: 'areaDisplay',
    testRef: 'src/test/rect-duct.test.ts',
    formulaCardRef: 'PRM-001',
    comment: 'Baseline from current engine/unit test only. Not a CAMduct confirmation.',
  },
  {
    id: 'PRM-001-rect-duct-A400-B300-L200-welded-pending',
    productCode: 'PRM-001',
    productTitle: 'Воздуховод прямоугольный',
    category: 'rectangular',
    formulaKey: 'PRM-001',
    calculatorKey: 'rect-duct',
    inputs: { A: 400, B: 300, L: 200, T: 0.5, Q: 1 },
    expectedResult: null,
    resultUnit: 'm2',
    expectedSource: null,
    status: 'pending',
    scope: 'welded-area',
    testRef: 'src/test/rect-duct.test.ts',
    formulaCardRef: 'PRM-001',
    comment: 'Pending CAMduct expected value. Existing test currently checks welded lock metadata only.',
  },
  {
    id: 'R-sp-001-spiral-duct-A250-B6000-baseline',
    productCode: 'R-sp-001',
    productTitle: 'Труба спирально-навивная',
    category: 'round',
    formulaKey: 'R-sp-001',
    calculatorKey: 'spiral-duct',
    inputs: { A: 250, B: 6000, Q: 1 },
    expectedResult: 4.712,
    resultUnit: 'm2',
    expectedSource: 'engine-baseline',
    toleranceAbs: 0.001,
    status: 'baseline',
    scope: 'areaDisplay',
    testRef: 'src/test/spiral-duct.test.ts',
    comment: 'Baseline from current engine/unit test only. Not a CAMduct confirmation.',
  },
  {
    id: 'R-sp-001-spiral-duct-A250-B14500-split-baseline',
    productCode: 'R-sp-001',
    productTitle: 'Труба спирально-навивная',
    category: 'round',
    formulaKey: 'R-sp-001',
    calculatorKey: 'spiral-duct',
    inputs: { A: 250, B: 14500, Q: 1, spiralSectionLength: 2000 },
    expectedResult: 11.388,
    resultUnit: 'm2',
    expectedSource: 'engine-baseline',
    toleranceAbs: 0.001,
    status: 'baseline',
    scope: 'areaDisplay+split',
    testRef: 'src/test/spiral-duct.test.ts',
    comment: 'Baseline from current engine/unit test only. Split summary in test: 7x2000+500.',
  },
]
