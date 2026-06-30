import type { AtlasCategoryConfig } from '../../config/atlas'
import { useTranslation } from 'react-i18next'
import { ProductFamilyCard } from './ProductFamilyCard'

interface ProductCategorySectionProps {
  category: AtlasCategoryConfig
}

export function ProductCategorySection({ category }: ProductCategorySectionProps) {
  const { i18n } = useTranslation()
  const lang = i18n.language as 'ru' | 'uk' | 'en'

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">{category.title[lang]}</h2>
      </div>

      <div className="space-y-6">
        {category.families.map((family) => (
          <ProductFamilyCard key={family.familyKey} family={family} />
        ))}
      </div>
    </section>
  )
}
