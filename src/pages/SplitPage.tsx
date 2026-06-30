import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ModuleCalculator } from '../components/Calculator/ModuleCalculator'
import { SplitLayout } from '../components/Layout/SplitLayout'
import { MaterialSummary } from '../components/Specification/MaterialSummary'
import { ProjectMetaForm } from '../components/Specification/ProjectMetaForm'
import { SpecActions } from '../components/Specification/SpecActions'
import { SpecSummary } from '../components/Specification/SpecSummary'
import { SpecTable } from '../components/Specification/SpecTable'
import { useAppStore } from '../store/appStore'

export function SplitPage() {
  const [searchParams] = useSearchParams()
  const setActiveModule = useAppStore((state) => state.setActiveModule)

  useEffect(() => {
    const module = searchParams.get('module')
    if (module === 'round-duct' || module === 'spiral-duct') {
      setActiveModule(module)
    }
  }, [searchParams, setActiveModule])

  return (
    <SplitLayout
      left={
        <>
          <ProjectMetaForm />
          <SpecTable />
          <SpecSummary />
          <MaterialSummary />
          <SpecActions />
        </>
      }
      right={<ModuleCalculator />}
    />
  )
}
