import type { AtlasFamilyConfig } from '../../config/atlas'
import { useTranslation } from 'react-i18next'
import { VariantCard } from './VariantCard'

interface ProductFamilyCardProps {
  family: AtlasFamilyConfig
}

export function ProductFamilyCard({ family }: ProductFamilyCardProps) {
  const { i18n } = useTranslation()
  const lang = i18n.language as 'ru' | 'uk' | 'en'

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div>
          <div className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
            <img src={family.image} alt={family.title[lang]} className="h-full w-full object-cover" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-slate-900">{family.title[lang]}</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {family.variants.map((variant) => (
            <VariantCard key={variant.code} variant={variant} />
          ))}
        </div>
      </div>
    </section>
  )
}
