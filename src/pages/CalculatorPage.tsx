import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ModuleCalculator } from '../components/Calculator/ModuleCalculator'

const supportedModules = new Set(['round-duct', 'spiral-duct', 'rect-duct'])

export function CalculatorPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const moduleFromQuery = searchParams.get('module')
  const hasSupportedModule = Boolean(moduleFromQuery && supportedModules.has(moduleFromQuery))
  const categoryLink = moduleFromQuery === 'rect-duct' ? '/atlas?category=rectangular' : '/atlas?category=round'
  const categoryLabel = moduleFromQuery === 'rect-duct' ? t('calculator.rectangularCategory') : t('calculator.roundCategory')

  return (
    <section className="calculator-page-v1">
      <div className="calculator-page-toolbar-v1">
        <Link to="/atlas">{t('calculator.backToAtlas')}</Link>
        <Link to={categoryLink}>{categoryLabel}</Link>
      </div>

      <div className="calculator-page-body-v1">
        {hasSupportedModule ? (
          <ModuleCalculator />
        ) : (
          <div className="calculator-page-empty-v1">
            <strong>{t('calculator.selectFromAtlas')}</strong>
            <span>{t('calculator.emptyDescription')}</span>
            <Link to="/atlas">{t('calculator.backToAtlas')}</Link>
          </div>
        )}
      </div>
    </section>
  )
}


