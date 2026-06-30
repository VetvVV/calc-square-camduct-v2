import { useTranslation } from 'react-i18next'

export function HomePage() {
  const { t } = useTranslation()

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_30%)] p-6 sm:p-8">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">ST Spetsmontazh</div>
            <h2 className="mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl">{t('page.homeTitle')}</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">{t('page.homeText')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
