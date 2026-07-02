import { Link, useSearchParams } from 'react-router-dom'
import { atlasConfig } from '../config/atlas'
import { ProductCategorySection } from '../components/Atlas/ProductCategorySection'
import { useTranslation } from 'react-i18next'

export function AtlasPage() {
  const { t, i18n } = useTranslation()
  const [searchParams] = useSearchParams()
  const activeCategory = searchParams.get('category')
  const selectedCategory = activeCategory ?? 'round'

  return (
    <section className="atlas-page-v1">
      <header className="atlas-intro-v1">
        <div>
          <h1>{t('atlas.title')}</h1>
        </div>
        <nav className="atlas-tabs-v1" aria-label={t('atlas.title')}>
          {atlasConfig.map((category) => {
            const lang = i18n.language as 'ru' | 'uk' | 'en'
            const active = selectedCategory === category.categoryKey
            return (
              <Link
                key={category.categoryKey}
                to={`/atlas?category=${category.categoryKey}`}
                className={active ? 'is-active' : ''}
                aria-current={active ? 'page' : undefined}
              >
                {category.title[lang].replace(' изделия', '').replace(' products', '')}
              </Link>
            )
          })}
        </nav>
      </header>

      {atlasConfig.map((category) => (
        <ProductCategorySection key={category.categoryKey} category={category} activeCategory={selectedCategory} />
      ))}
    </section>
  )
}
