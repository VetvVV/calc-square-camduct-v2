import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../store/appStore'

export function CamductToggle() {
  const { t } = useTranslation()
  const camductMode = useAppStore((state) => state.camductMode)
  const toggleCamductMode = useAppStore((state) => state.toggleCamductMode)

  return (
    <button
      type="button"
      onClick={toggleCamductMode}
      className={[
        'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
        camductMode
          ? 'border-blue-600 bg-blue-600 text-white'
          : 'border-slate-300 bg-white text-slate-700',
      ].join(' ')}
    >
      {t('action.serviceMode')} {camductMode ? 'ON' : 'OFF'}
    </button>
  )
}
