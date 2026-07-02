import type { AtlasCategoryConfig } from '../../config/atlas'
import { useTranslation } from 'react-i18next'
import { VariantCard } from './VariantCard'

interface ProductCategorySectionProps {
  category: AtlasCategoryConfig
}

export function ProductCategorySection({ category }: ProductCategorySectionProps) {
  const { i18n } = useTranslation()
  const lang = i18n.language as 'ru' | 'uk' | 'en'

  return (
    <section className="atlas-section-v1" id={`atlas-${category.categoryKey}`}>
      <div className="atlas-section-head-v1">
        <h2>{category.title[lang]}</h2>
        <div className="atlas-count-v1">{category.items.length}</div>
      </div>
      <div className="atlas-grid-v1">
        {category.items.map((item) => (
          <VariantCard key={item.code} variant={item} />
        ))}
      </div>
    </section>
  )
}
