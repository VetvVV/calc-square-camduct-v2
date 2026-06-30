import { useTranslation } from 'react-i18next'
import { useProjectStore } from '../../store/projectStore'

export function ProjectMetaForm() {
  const { t } = useTranslation()
  const project = useProjectStore((state) => state.project)

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="text-lg font-semibold text-slate-900">{t('project.metadataTitle')}</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">{t('project.project')}</div>
          <div className="mt-1 font-medium text-slate-900">{project.name}</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">{t('project.customer')}</div>
          <div className="mt-1 font-medium text-slate-900">{project.customer || '—'}</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">{t('project.object')}</div>
          <div className="mt-1 font-medium text-slate-900">{project.object || '—'}</div>
        </div>
      </div>
    </div>
  )
}
