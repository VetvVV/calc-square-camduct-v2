import { useTranslation } from 'react-i18next'
import { useProjectStore } from '../../store/projectStore'

export function ProjectMetaForm() {
  const { t } = useTranslation()
  const project = useProjectStore((state) => state.project)

  return (
    <div className="brand-section overflow-hidden">
      <div className="brand-section-head px-4 py-3"><h3 className="text-base font-extrabold text-[#5b4e2a]">{t('project.metadataTitle')}</h3></div>
      <div className="grid gap-0 md:grid-cols-3">
        <div className="border-t border-[#e7ddc2] bg-white px-4 py-3 md:border-l md:border-t-0 first:md:border-l-0">
          <div className="text-sm text-slate-500">{t('project.project')}</div>
          <div className="mt-1 font-medium text-slate-900">{project.name}</div>
        </div>
        <div className="border-t border-[#e7ddc2] bg-white px-4 py-3 md:border-l md:border-t-0 first:md:border-l-0">
          <div className="text-sm text-slate-500">{t('project.customer')}</div>
          <div className="mt-1 font-medium text-slate-900">{project.customer || '—'}</div>
        </div>
        <div className="border-t border-[#e7ddc2] bg-white px-4 py-3 md:border-l md:border-t-0 first:md:border-l-0">
          <div className="text-sm text-slate-500">{t('project.object')}</div>
          <div className="mt-1 font-medium text-slate-900">{project.object || '—'}</div>
        </div>
      </div>
    </div>
  )
}
