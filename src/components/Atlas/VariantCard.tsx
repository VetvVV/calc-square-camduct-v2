import { Link } from 'react-router-dom'
import type { AtlasVariantConfig } from '../../config/atlas'
import { useTranslation } from 'react-i18next'

interface VariantCardProps {
  variant: AtlasVariantConfig
}

export function VariantCard({ variant }: VariantCardProps) {
  const { i18n } = useTranslation()
  const lang = i18n.language as 'ru' | 'uk' | 'en'

  return (
    <Link
      to={`/split?module=${variant.moduleKey}`}
      className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-400 hover:shadow-md"
    >
      <div className="aspect-[16/10] overflow-hidden rounded-lg bg-slate-100">
        <img
          src={variant.image}
          alt={variant.title[lang]}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="mt-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-blue-600">{variant.code}</div>
        <h4 className="mt-1 text-base font-semibold text-slate-900">{variant.title[lang]}</h4>
      </div>
    </Link>
  )
}
