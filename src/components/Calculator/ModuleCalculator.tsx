import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import type { ModuleKey } from '../../types'
import { RoundDuctCalculator } from './RoundDuctCalculator'
import { SpiralDuctCalculator } from './SpiralDuctCalculator'
import { RectDuctCalculator } from './RectDuctCalculator'

interface ModuleCalculatorProps {
  moduleKey?: ModuleKey
}

function isSupportedModule(value: string | null): value is ModuleKey {
  return value === 'spiral-duct' || value === 'round-duct' || value === 'rect-duct'
}

export function ModuleCalculator({ moduleKey }: ModuleCalculatorProps = {}) {
  const [searchParams] = useSearchParams()
  const storeModule = useAppStore((state) => state.activeModule)
  const moduleFromQuery = searchParams.get('module')

  const activeModule = useMemo(() => {
    return moduleKey ?? (isSupportedModule(moduleFromQuery) ? moduleFromQuery : storeModule)
  }, [moduleFromQuery, moduleKey, storeModule])

  if (activeModule === 'round-duct') {
    return <RoundDuctCalculator />
  }

  if (activeModule === 'spiral-duct') {
    return <SpiralDuctCalculator />
  }

  if (activeModule === 'rect-duct') {
    return <RectDuctCalculator />
  }

  return null
}
