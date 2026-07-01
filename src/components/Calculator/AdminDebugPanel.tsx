import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface AdminDebugPanelProps {
  data: unknown
}

export function AdminDebugPanel({ data }: AdminDebugPanelProps) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  return (
    <section className="overflow-hidden rounded-xl border border-[#505760] bg-[#343a40] shadow-sm">
      <div className="flex flex-col gap-3 border-b border-[#505760] px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center rounded-full border border-[#d77a1f]/40 bg-[#d77a1f]/12 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#f4b26b]">
            {t('message.debug.badge')}
          </div>
          <h4 className="mt-2 text-sm font-semibold text-slate-100">{t('message.debug.title')}</h4>
          <p className="mt-1 text-xs leading-5 text-slate-300">{t('message.debug.description')}</p>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="rounded-lg border border-[#666d76] bg-[#2f343a] px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-[#d77a1f]/70 hover:text-white"
        >
          {expanded ? t('action.hideDebug') : t('action.showDebug')}
        </button>
      </div>

      {expanded ? (
        <div className="grid gap-3 px-4 py-3 lg:grid-cols-[180px_1fr]">
          <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-lg border border-[#505760] bg-[#2f343a] p-3">
              <div className="text-[11px] uppercase tracking-[0.12em] text-slate-400">JSON</div>
              <div className="mt-1 text-sm font-semibold text-slate-100">Live payload</div>
            </div>
            <div className="rounded-lg border border-[#505760] bg-[#2f343a] p-3">
              <div className="text-[11px] uppercase tracking-[0.12em] text-slate-400">Visibility</div>
              <div className="mt-1 text-sm font-semibold text-slate-100">Admin / Service</div>
            </div>
            <div className="rounded-lg border border-[#505760] bg-[#2f343a] p-3">
              <div className="text-[11px] uppercase tracking-[0.12em] text-slate-400">Mode</div>
              <div className="mt-1 text-sm font-semibold text-[#f4b26b]">Internal trace</div>
            </div>
          </div>
          <pre className="max-h-[26rem] overflow-auto rounded-lg border border-[#505760] bg-[#2f343a] p-4 text-xs leading-6 text-slate-100">{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : null}
    </section>
  )
}
