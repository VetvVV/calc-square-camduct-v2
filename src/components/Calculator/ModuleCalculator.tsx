import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import { RoundDuctCalculator } from './RoundDuctCalculator'
import { SpiralDuctCalculator } from './SpiralDuctCalculator'
import { RectDuctCalculator } from './RectDuctCalculator'

export function ModuleCalculator() {
  const [searchParams] = useSearchParams()
  const storeModule = useAppStore((state) => state.activeModule)
  const moduleFromQuery = searchParams.get('module')

  const activeModule = useMemo(() => {
    return moduleFromQuery === 'spiral-duct' || moduleFromQuery === 'round-duct' || moduleFromQuery === 'rect-duct'
      ? moduleFromQuery
      : storeModule
  }, [moduleFromQuery, storeModule])

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
