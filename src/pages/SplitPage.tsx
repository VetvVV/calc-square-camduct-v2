import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ModuleCalculator } from '../components/Calculator/ModuleCalculator'
import { SplitLayout } from '../components/Layout/SplitLayout'
import { MaterialSummary } from '../components/Specification/MaterialSummary'
import { ProjectMetaForm } from '../components/Specification/ProjectMetaForm'
import { SpecActions } from '../components/Specification/SpecActions'
import { SpecSummary } from '../components/Specification/SpecSummary'
import { SpecTable } from '../components/Specification/SpecTable'
import { Alert } from '../components/Common/Alert'
import { useAppStore } from '../store/appStore'
import { canUseProjectFiles, canViewSpecification } from '../roles/permissions'
import { useTranslation } from 'react-i18next'

export function SplitPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const setActiveModule = useAppStore((state) => state.setActiveModule)
  const role = useAppStore((state) => state.role)
  const showSpecification = canViewSpecification(role)
  const showProjectFiles = canUseProjectFiles(role)

  useEffect(() => {
    const module = searchParams.get('module')
    if (module === 'round-duct' || module === 'spiral-duct') {
      setActiveModule(module)
    }
  }, [searchParams, setActiveModule])

  if (!showSpecification) {
    return (
      <SplitLayout
        left={
          <Alert tone="info" title={t('access.previewModeTitle')}>
            {t('access.previewModeDescription')}
          </Alert>
        }
        right={<ModuleCalculator />}
      />
    )
  }

  return (
    <SplitLayout
      left={
        <>
          <ProjectMetaForm />
          <SpecTable />
          <SpecSummary />
          <MaterialSummary />
          {showProjectFiles ? <SpecActions /> : <SpecActions locked />}
        </>
      }
      right={<ModuleCalculator />}
    />
  )
}
