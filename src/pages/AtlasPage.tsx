import { atlasConfig } from '../config/atlas'
import { ProductCategorySection } from '../components/Atlas/ProductCategorySection'
import { useTranslation } from 'react-i18next'
import { PageSection } from '../components/Common/PageSection'

export function AtlasPage() {
  const { t } = useTranslation()

  return (
    <section className="space-y-6">
      <PageSection
        title={t('page.atlasTitle')}
        description={t('page.atlasDescription')}
      >
        <div />
      </PageSection>

      {atlasConfig.map((category) => (
        <ProductCategorySection key={category.categoryKey} category={category} />
      ))}
    </section>
  )
}
