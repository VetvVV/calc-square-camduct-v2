import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Alert } from '../components/Common/Alert'
import { MaterialSummary } from '../components/Specification/MaterialSummary'
import { ProjectMetaForm } from '../components/Specification/ProjectMetaForm'
import { SpecActions } from '../components/Specification/SpecActions'
import { SpecSummary } from '../components/Specification/SpecSummary'
import { SpecTable } from '../components/Specification/SpecTable'
import { useAppStore } from '../store/appStore'
import { canUseProjectFiles, canViewSpecification } from '../roles/permissions'

export function SpecificationPage() {
  const { t } = useTranslation()
  const role = useAppStore((state) => state.role)
  const showProjectFiles = canUseProjectFiles(role)

  if (!canViewSpecification(role)) {
    return (
      <section className="brand-section space-y-4 p-5">
        <h2 className="text-2xl font-extrabold uppercase tracking-[0.03em] text-[#5b6573]">{t('page.specificationTitle')}</h2>
        <Alert tone="warning" title={t('access.lockedTitle')}>
          {t('access.specificationLockedDescription')}
        </Alert>
        <Link to="/atlas" className="brand-action-button inline-flex px-4 py-2 text-sm">
          {t('calculator.backToAtlas')}
        </Link>
      </section>
    )
  }

  return (
    <section className="specification-page-v1">
      <header className="specification-page-head-v1">
        <p>{t('project.metadataTitle')}</p>
        <h2>{t('page.specificationTitle')}</h2>
      </header>
      <ProjectMetaForm />
      <SpecTable />
      <div className="specification-page-summary-v1">
        <SpecSummary />
        <MaterialSummary />
      </div>
      {showProjectFiles ? <SpecActions /> : <SpecActions locked />}
    </section>
  )
}

