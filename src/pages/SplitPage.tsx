import { useEffect } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
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
import type { ModuleKey } from '../types'

const supportedModules = new Set<ModuleKey>(['round-duct', 'spiral-duct', 'rect-duct'])

function isSupportedModule(value: string | null): value is ModuleKey {
  return value !== null && supportedModules.has(value as ModuleKey)
}

export function SplitPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const setActiveModule = useAppStore((state) => state.setActiveModule)
  const role = useAppStore((state) => state.role)
  const showSpecification = canViewSpecification(role)
  const showProjectFiles = canUseProjectFiles(role)
  const moduleFromQuery = searchParams.get('module')
  const selectedModule = isSupportedModule(moduleFromQuery) ? moduleFromQuery : undefined
  const hasSupportedModule = Boolean(selectedModule)

  useEffect(() => {
    if (selectedModule) {
      setActiveModule(selectedModule)
    }
  }, [selectedModule, setActiveModule])

  if (!showSpecification) {
    if (hasSupportedModule) {
      return <Navigate to={`/calculator?module=${selectedModule}`} replace />
    }

    return (
      <section className="brand-section space-y-4 p-5">
        <h2 className="text-2xl font-extrabold uppercase tracking-[0.03em] text-[#5b6573]">{t('page.splitTitle')}</h2>
        <Alert tone="warning" title={t('access.lockedTitle')}>
          {t('access.workspaceLockedDescription')}
        </Alert>
        <Link to="/atlas" className="brand-action-button inline-flex px-4 py-2 text-sm">
          {t('calculator.backToAtlas')}
        </Link>
      </section>
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
      right={<ModuleCalculator moduleKey={selectedModule} />}
    />
  )
}

