import { useTranslation } from 'react-i18next'
import { Alert } from '../components/Common/Alert'
import { useAppStore } from '../store/appStore'
import { canViewSpecification } from '../roles/permissions'

export function SpecificationPage() {
  const { t } = useTranslation()
  const role = useAppStore((state) => state.role)

  if (!canViewSpecification(role)) {
    return (
      <section className="brand-section space-y-4 p-5">
        <h2 className="text-2xl font-extrabold uppercase tracking-[0.03em] text-[#5b6573]">{t('page.specificationTitle')}</h2>
        <Alert tone="warning" title={t('access.lockedTitle')}>
          {t('access.lockedDescription')}
        </Alert>
      </section>
    )
  }

  return (
    <section className="brand-section space-y-4 p-5">
      <h2 className="text-2xl font-extrabold uppercase tracking-[0.03em] text-[#5b6573]">{t('page.specificationTitle')}</h2>
      <Alert tone="info" title={t('project.specificationTitle')}>
        {t('action.projectActionsDescription')}
      </Alert>
    </section>
  )
}
