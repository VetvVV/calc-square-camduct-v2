import type { AtlasCategoryConfig } from '../../config/atlas'
import { useTranslation } from 'react-i18next'
import { VariantCard } from './VariantCard'

interface ProductCategorySectionProps {
  category: AtlasCategoryConfig
  activeCategory?: string | null
}

export function ProductCategorySection({ category, activeCategory }: ProductCategorySectionProps) {
  const { i18n } = useTranslation()
  const lang = i18n.language as 'ru' | 'uk' | 'en'
  const isInactive = Boolean(activeCategory && activeCategory !== category.categoryKey)

  return (
    <section className={['atlas-section-v1', isInactive ? 'is-inactive' : ''].join(' ')} id={`atlas-${category.categoryKey}`}>
      <div className="atlas-section-head-v1">
        <h2>{category.title[lang]}</h2>
        <div className="atlas-count-v1">{category.items.length}</div>
      </div>
      {isInactive ? null : (
        <div className="atlas-grid-v1">
          {category.items.map((item) => (
            <VariantCard key={item.code} variant={item} />
          ))}
        </div>
      )}
    </section>
  )
}
