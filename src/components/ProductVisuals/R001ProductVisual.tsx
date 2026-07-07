interface R001ProductVisualProps {
  title?: string
}

export function R001ProductVisual({ title = 'KRG-001 Воздуховод круглый / труба прямошовная' }: R001ProductVisualProps) {
  return (
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title} className="product-svg product-svg--krg-001">
      <g className="p-shadow">
        <ellipse cx="206" cy="236" rx="152" ry="12" fill="var(--p-shadow, #1f2328)" opacity="var(--p-shadow-opacity, 0.07)" />
      </g>

      <g className="p-body">
        <path d="M 72 96 L 338 96 A 26 54 0 0 1 338 204 L 72 204 Z" fill="var(--p-body, #f4f6f8)" />
        <ellipse cx="72" cy="150" rx="26" ry="54" fill="var(--p-inner, #e8ebee)" />
        <ellipse cx="75" cy="150" rx="20" ry="47" fill="#1f2328" opacity="0.05" />
      </g>

      <g className="p-form" stroke="var(--p-outline, #4d5156)" fill="none" strokeWidth="1.25" opacity="0.45">
        <ellipse cx="72" cy="150" rx="20.5" ry="48" vectorEffect="non-scaling-stroke" />
        <path d="M 338 101 A 21 49 0 0 1 338 199" vectorEffect="non-scaling-stroke" />
        <line x1="86" y1="101" x2="334" y2="101" vectorEffect="non-scaling-stroke" />
        <line x1="86" y1="105" x2="334" y2="105" vectorEffect="non-scaling-stroke" />
      </g>

      <g className="p-outline" stroke="var(--p-outline, #4d5156)" fill="none" strokeWidth="2" strokeLinecap="round">
        <line x1="72" y1="96" x2="338" y2="96" vectorEffect="non-scaling-stroke" />
        <line x1="72" y1="204" x2="338" y2="204" vectorEffect="non-scaling-stroke" />
        <path d="M 338 96 A 26 54 0 0 1 338 204" vectorEffect="non-scaling-stroke" />
        <ellipse cx="72" cy="150" rx="26" ry="54" vectorEffect="non-scaling-stroke" />
      </g>

      <g className="p-dims" opacity="0" fontFamily="ui-sans-serif, system-ui, Arial, sans-serif" fontSize="15" fontWeight="600">
        <g className="p-dim-d" stroke="var(--p-dim-d, #1455ff)" fill="var(--p-dim-d, #1455ff)">
          <line className="p-dim-line" x1="66" y1="96" x2="32" y2="96" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <line className="p-dim-line" x1="66" y1="204" x2="32" y2="204" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <line className="p-dim-line" x1="36" y1="104" x2="36" y2="196" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <polygon className="p-dim-arrow" points="36,96 32,105 40,105" stroke="none" />
          <polygon className="p-dim-arrow" points="36,204 32,195 40,195" stroke="none" />
          <text className="p-dim-label" x="6" y="155" stroke="none">⌀D</text>
        </g>

        <g className="p-dim-l" stroke="var(--p-dim-l, #0a8a22)" fill="var(--p-dim-l, #0a8a22)">
          <line className="p-dim-line" x1="72" y1="210" x2="72" y2="258" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <line className="p-dim-line" x1="338" y1="210" x2="338" y2="258" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <line className="p-dim-line" x1="81" y1="252" x2="329" y2="252" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <polygon className="p-dim-arrow" points="72,252 81,248 81,256" stroke="none" />
          <polygon className="p-dim-arrow" points="338,252 329,248 329,256" stroke="none" />
          <text className="p-dim-label" x="196" y="246" stroke="none">L</text>
        </g>
      </g>

      <g className="p-accents" opacity="0">
        <line x1="86" y1="103" x2="334" y2="103" stroke="var(--p-accent, #df7a12)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  )
}
