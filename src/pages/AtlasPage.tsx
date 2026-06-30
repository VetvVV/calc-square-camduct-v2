import { atlasConfig } from '../config/atlas'
import { ProductCategorySection } from '../components/Atlas/ProductCategorySection'
import { useTranslation } from 'react-i18next'

export function AtlasPage() {
  const { t } = useTranslation()

  return (
    <section className="atlas-page-v1">
      <header className="atlas-intro-v1">
        <div>
          <h1>{t('atlas.title')}</h1>
          <p>{t('atlas.description')}</p>
        </div>
      </header>

      {atlasConfig.map((category) => (
        <ProductCategorySection key={category.categoryKey} category={category} />
      ))}
    </section>
  )
}
