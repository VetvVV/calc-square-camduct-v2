import { useTranslation } from 'react-i18next'
import { Alert } from '../components/Common/Alert'

export function SpecificationPage() {
  const { t } = useTranslation()

  return (
    <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">{t('page.specificationTitle')}</h2>
      <Alert tone="info" title={t('project.specificationTitle')}>
        {t('action.projectActionsDescription')}
      </Alert>
    </section>
  )
}
