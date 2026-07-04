import type { SpecificationItem } from '../../types'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'
import { R001ProductVisual, Rect001ProductVisual, Rsp001ProductVisual } from '../ProductVisuals'

interface SpecRowPreviewProps {
  id: string
  item: SpecificationItem
  position: number
  anchorRect: DOMRect | null
  open: boolean
  productTitle: string
  dimensions: string
  material: string
  thickness: string
  area: string
  mass: string
}

function productCode(item: SpecificationItem) {
  if (item.moduleKey === 'round-duct') return 'R-001'
  if (item.moduleKey === 'spiral-duct') return 'R-sp-001'
  if (item.moduleKey === 'rect-duct') return 'RECT-001'
  return null
}

function productVisual(item: SpecificationItem, title: string) {
  if (item.moduleKey === 'round-duct') return <R001ProductVisual title={title} />
  if (item.moduleKey === 'spiral-duct') return <Rsp001ProductVisual title={title} />
  if (item.moduleKey === 'rect-duct') return <Rect001ProductVisual title={title} />
  return null
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function previewPosition(anchorRect: DOMRect) {
  const margin = 12
  const gap = 10
  const width = 320
  const estimatedHeight = 236
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight
  const rightSide = anchorRect.right + gap
  const leftSide = anchorRect.left - width - gap
  const left = rightSide + width <= viewportWidth - margin ? rightSide : clamp(leftSide, margin, viewportWidth - width - margin)
  const top = clamp(anchorRect.top - 6, margin, Math.max(margin, viewportHeight - estimatedHeight - margin))

  return { left, top }
}

export function SpecRowPreview({ id, item, position, anchorRect, open, productTitle, dimensions, material, thickness, area, mass }: SpecRowPreviewProps) {
  const { t } = useTranslation()
  const code = productCode(item)

  if (!open || !anchorRect) return null

  const positionStyle = previewPosition(anchorRect)
  const visual = productVisual(item, code ? `${code} ${productTitle}` : productTitle)

  return createPortal(
    <div id={id} className="spec-row-preview-v1" role="tooltip" style={positionStyle}>
      <div className="spec-row-preview-visual-v1" aria-hidden="true">
        {visual ?? (
          <span>{code ?? productTitle}</span>
        )}
      </div>
      <div className="spec-row-preview-body-v1">
        <div className="spec-row-preview-position-v1">{t('spec.preview.positionTitle', { index: position })}</div>
        {code ? <div className="spec-row-preview-code-v1">{code}</div> : null}
        <strong>{productTitle}</strong>
        <small>{dimensions}</small>
        <dl>
          <div>
            <dt>{t('spec.preview.quantity')}</dt>
            <dd>{item.quantity}</dd>
          </div>
          <div>
            <dt>{t('spec.preview.material')}</dt>
            <dd>{material}</dd>
          </div>
          <div>
            <dt>{t('spec.preview.thickness')}</dt>
            <dd>{thickness}</dd>
          </div>
          <div>
            <dt>{t('spec.preview.area')}</dt>
            <dd>{area}</dd>
          </div>
          <div>
            <dt>{t('spec.preview.mass')}</dt>
            <dd>{mass}</dd>
          </div>
        </dl>
      </div>
    </div>,
    document.body,
  )
}
