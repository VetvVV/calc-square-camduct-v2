import { Link } from 'react-router-dom'
import type { AtlasItemConfig } from '../../config/atlas'
import { useTranslation } from 'react-i18next'
import { R001ProductVisual, Rect001ProductVisual } from '../ProductVisuals'

interface VariantCardProps {
  variant: AtlasItemConfig
}

export function VariantCard({ variant }: VariantCardProps) {
  const { i18n, t } = useTranslation()
  const lang = i18n.language as 'ru' | 'uk' | 'en'
  const available = variant.status === 'available' && Boolean(variant.moduleKey)
  const useInlineR001Visual = variant.code === 'R-001'
  const useInlineRect001Visual = variant.code === 'RECT-001'

  const content = (
    <>
      <div className="atlas-image-v1">
        {useInlineR001Visual ? (
          <R001ProductVisual title={`${variant.code} ${variant.title[lang]}`} />
        ) : useInlineRect001Visual ? (
          <Rect001ProductVisual title={`${variant.code} ${variant.title[lang]}`} />
        ) : variant.image ? (
          <img
            src={variant.image}
            alt={variant.title[lang]}
          />
        ) : (
          <div className="atlas-placeholder-v1" aria-hidden="true">{variant.code}</div>
        )}
      </div>
      <div className="atlas-caption-v1">
        <div className="atlas-code-v1">{variant.code}</div>
        <h3 className="atlas-title-v1">{variant.title[lang]}</h3>
        <div className={['atlas-status-v1', available ? 'is-active' : ''].join(' ')}>
          {available ? t('atlas.openCalculator') : t('atlas.moduleUnavailable')}
        </div>
      </div>
    </>
  )

  const className = 'atlas-tile-v1 group'

  if (!available) {
    return (
      <article className={className} aria-disabled="true">
        {content}
      </article>
    )
  }

  return (
    <Link to={`/calculator?module=${variant.moduleKey}`} className={className} aria-label={`${t('atlas.openCalculator')}: ${variant.title[lang]}`}>
      {content}
    </Link>
  )
}
