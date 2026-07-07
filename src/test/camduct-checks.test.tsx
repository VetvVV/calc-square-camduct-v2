import { describe, expect, it } from 'vitest'
import { camductChecks, camductDiff } from '../domain/verification/camductChecks'

describe('CAMduct verification registry', () => {
  it('uses unique check ids', () => {
    const ids = camductChecks.map((check) => check.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('keeps pending entries without expected values', () => {
    const pending = camductChecks.filter((check) => check.status === 'pending')

    expect(pending.length).toBeGreaterThan(0)
    for (const check of pending) {
      expect(check.expectedResult).toBeNull()
      expect(check.expectedSource).toBeNull()
    }
  })

  it('marks baseline entries as engine baselines only', () => {
    const baselines = camductChecks.filter((check) => check.status === 'baseline')

    expect(baselines.length).toBeGreaterThan(0)
    for (const check of baselines) {
      expect(check.expectedSource).toBe('engine-baseline')
      expect(check.status).toBe('baseline')
    }
  })

  it('requires CAMduct evidence for confirmed entries', () => {
    const confirmed = camductChecks.filter((check) => check.status === 'confirmed')

    for (const check of confirmed) {
      expect(check.expectedSource).toBe('camduct')
      expect(check.expectedResult).toEqual(expect.any(Number))
      expect(check.camductVersion).toBeTruthy()
      expect(check.checkedAt).toBeTruthy()
      expect(Boolean(check.screenshotRef || check.evidenceRef)).toBe(true)
    }
  })

  it('reports actual result within absolute tolerance', () => {
    const check = camductChecks.find((entry) => entry.id === 'KRG-001-round-duct-A250-B1000-baseline')

    expect(check).toBeDefined()
    expect(camductDiff(check!, 0.8104)).toMatchObject({
      status: 'within-tolerance',
      withinTolerance: true,
      skipped: false,
    })
  })

  it('does not fail pending checks', () => {
    const check = camductChecks.find((entry) => entry.status === 'pending')

    expect(check).toBeDefined()
    expect(camductDiff(check!, 123)).toMatchObject({
      status: 'pending',
      expectedResult: null,
      diffAbs: null,
      diffPct: null,
      withinTolerance: null,
      skipped: true,
    })
  })
})
