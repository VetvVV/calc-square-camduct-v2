import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface AdminDebugPanelProps {
  data: unknown
}

export function AdminDebugPanel({ data }: AdminDebugPanelProps) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-xl shadow-slate-900/10">
      <div className="flex flex-col gap-3 border-b border-slate-800 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_45%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.14),_transparent_35%)] px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
            CAMduct / service
          </div>
          <h4 className="mt-2 text-sm font-semibold text-white">{t('message.debug.title')}</h4>
          <p className="mt-1 text-xs leading-5 text-slate-400">{t('message.debug.description')}</p>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-cyan-400/40 hover:text-white"
        >
          {expanded ? t('action.hideDebug') : t('action.showDebug')}
        </button>
      </div>

      <div className="grid gap-4 px-5 py-4 lg:grid-cols-[220px_1fr]">
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3">
            <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">JSON</div>
            <div className="mt-1 text-sm font-semibold text-white">Live payload</div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3">
            <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Visibility</div>
            <div className="mt-1 text-sm font-semibold text-white">Admin / Service</div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3">
            <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Mode</div>
            <div className="mt-1 text-sm font-semibold text-emerald-300">Internal trace</div>
          </div>
        </div>

        {expanded ? (
          <pre className="max-h-[32rem] overflow-auto rounded-2xl border border-slate-800 bg-slate-900 p-4 text-xs leading-6 text-slate-100">{JSON.stringify(data, null, 2)}</pre>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-6 text-sm text-slate-400">
            {t('message.debug.collapsedHint')}
          </div>
        )}
      </div>
    </section>
  )
}
