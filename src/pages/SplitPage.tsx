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

const supportedModules = new Set(['round-duct', 'spiral-duct'])

export function SplitPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const setActiveModule = useAppStore((state) => state.setActiveModule)
  const role = useAppStore((state) => state.role)
  const showSpecification = canViewSpecification(role)
  const showProjectFiles = canUseProjectFiles(role)
  const moduleFromQuery = searchParams.get('module')
  const hasSupportedModule = Boolean(moduleFromQuery && supportedModules.has(moduleFromQuery))

  useEffect(() => {
    if (moduleFromQuery === 'round-duct' || moduleFromQuery === 'spiral-duct') {
      setActiveModule(moduleFromQuery)
    }
  }, [moduleFromQuery, setActiveModule])

  if (!showSpecification) {
    if (hasSupportedModule) {
      return <Navigate to={`/calculator?module=${moduleFromQuery}`} replace />
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
      right={<ModuleCalculator />}
    />
  )
}
