import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function HomePage() {
  const { t } = useTranslation()

  const heroSteps = [
    ['01', t('home.stepAtlas')],
    ['02', t('home.stepCalculate')],
    ['03', t('home.stepSpec')],
  ]

  const stats = [
    ['3', t('home.statsLanguages')],
    ['RU / UK / EN', t('home.statsI18n')],
    ['1', t('home.statsProject')],
    ['JSON', t('home.statsExport')],
    ['ST', t('home.statsCamduct')],
  ]

  const features = [
    ['01', t('home.featureCatalog')],
    ['02', t('home.featureCalculators')],
    ['03', t('home.featureSpecification')],
    ['04', t('home.featureExport')],
    ['05', t('home.featureWorkflow')],
    ['06', t('home.featureAdmin')],
  ]

  const categories = [
    [t('home.categoryRound'), t('atlas.status.available')],
    [t('home.categoryRectangular'), t('atlas.status.comingSoon')],
    [t('home.categoryCombined'), t('atlas.status.comingSoon')],
  ]

  const scenario = [
    ['01', t('home.stepAtlas')],
    ['02', t('home.scenarioParameters')],
    ['03', t('home.stepSpec')],
    ['04', t('home.scenarioExport')],
  ]

  return (
    <section className="home-landing-v1">
      <section className="home-landing-hero-v1">
        <div className="home-landing-copy-v1">
          <div className="home-kicker-v1">ST Spetsmontazh</div>
          <h1>{t('home.heroTitle')}</h1>
          <p>{t('home.heroSubtitle')}</p>
          <div className="home-actions-v1">
            <Link to="/atlas" className="brand-action-button px-5 py-3 text-sm">
              {t('home.openAtlas')}
            </Link>
            <Link to="/split">{t('home.createSpecification')}</Link>
            <Link to="/split?module=round-duct">{t('home.startRound')}</Link>
          </div>
        </div>
        <div className="home-steps-card-v1" aria-label={t('home.stepsTitle')}>
          <h2>{t('home.stepsTitle')}</h2>
          {heroSteps.map(([index, label]) => (
            <div key={index} className="home-step-row-v1">
              <span>{index}</span>
              <strong>{label}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="home-stats-v1" aria-label={t('home.statsTitle')}>
        {stats.map(([value, label]) => (
          <div key={`${value}-${label}`}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="home-section-v1">
        <div className="home-section-head-v1">
          <h2>{t('home.featuresTitle')}</h2>
        </div>
        <div className="home-feature-grid-v1">
          {features.map(([index, label]) => (
            <article key={index} className="home-info-tile-v1">
              <span>{index}</span>
              <h3>{label}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section-v1">
        <div className="home-section-head-v1">
          <h2>{t('home.categoriesTitle')}</h2>
        </div>
        <div className="home-category-grid-v1">
          {categories.map(([title, status], index) => (
            <article key={title} className={index === 0 ? 'is-active' : ''}>
              <h3>{title}</h3>
              <span>{status}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section-v1">
        <div className="home-section-head-v1">
          <h2>{t('home.scenarioTitle')}</h2>
        </div>
        <div className="home-scenario-v1">
          {scenario.map(([index, label]) => (
            <div key={index}>
              <span>{index}</span>
              <strong>{label}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="home-cta-v1">
        <div>
          <h2>{t('home.ctaTitle')}</h2>
          <p>{t('home.ctaSubtitle')}</p>
        </div>
        <div className="home-actions-v1">
          <Link to="/atlas" className="brand-action-button px-5 py-3 text-sm">
            {t('home.ctaOpenAtlas')}
          </Link>
          <Link to="/split">{t('home.ctaCreateSpec')}</Link>
        </div>
      </section>

      <section className="home-contact-v1">
        <div>
          <h2>{t('home.contactTitle')}</h2>
          <p>{t('home.contactSubtitle')}</p>
        </div>
        <div className="home-contact-list-v1">
          <a href="tel:+380445022592">+38 (044) 502-25-92</a>
          <a href="tel:+380674685551">+38 (067) 468-55-51</a>
          <a href="mailto:office@stspetsmontag.com.ua">office@stspetsmontag.com.ua</a>
          <a href="https://stspetsmontag.com.ua" target="_blank" rel="noreferrer">stspetsmontag.com.ua</a>
          <span>{t('home.contactProject')}</span>
          <button type="button">{t('home.contactAction')}</button>
        </div>
      </section>

      <footer className="home-footer-v1">
        <span>ST Spetsmontazh · Calc Square</span>
      </footer>
    </section>
  )
}
