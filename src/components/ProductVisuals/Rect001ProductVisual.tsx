interface Rect001ProductVisualProps {
  title?: string
}

export function Rect001ProductVisual({ title = 'RECT-001 Прямоугольный воздуховод' }: Rect001ProductVisualProps) {
  return (
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title} className="product-svg product-svg--rect-001">
      <g className="p-shadow">
        <ellipse cx="206" cy="236" rx="154" ry="13" fill="var(--p-shadow, #1f2328)" opacity="var(--p-shadow-opacity, 0.07)" />
      </g>

      <g className="p-body">
        <path d="M 74 94 L 312 70 L 342 112 L 104 136 Z" fill="var(--p-top, #f7f8fa)" />
        <path d="M 104 136 L 342 112 L 342 196 L 104 220 Z" fill="var(--p-body, #edf0f3)" />
        <path d="M 74 94 L 104 136 L 104 220 L 74 178 Z" fill="var(--p-inner, #e3e7eb)" />
        <path d="M 84 111 L 96 138 L 96 204 L 84 176 Z" fill="#1f2328" opacity="0.05" />
      </g>

      <g className="p-form" stroke="var(--p-outline, #4d5156)" fill="none" strokeWidth="1.25" opacity="0.45">
        <path d="M 88 112 L 106 138 L 106 205 L 88 177 Z" vectorEffect="non-scaling-stroke" />
        <path d="M 104 136 L 342 112" vectorEffect="non-scaling-stroke" />
        <path d="M 104 142 L 342 118" vectorEffect="non-scaling-stroke" />
        <path d="M 118 132 L 326 111" vectorEffect="non-scaling-stroke" />
        <path d="M 111 216 L 335 193" vectorEffect="non-scaling-stroke" />
      </g>

      <g className="p-outline" stroke="var(--p-outline, #4d5156)" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 74 94 L 312 70 L 342 112 L 104 136 Z" vectorEffect="non-scaling-stroke" />
        <path d="M 74 94 L 104 136 L 104 220 L 74 178 Z" vectorEffect="non-scaling-stroke" />
        <path d="M 104 136 L 342 112 L 342 196 L 104 220 Z" vectorEffect="non-scaling-stroke" />
        <path d="M 84 111 L 96 138 L 96 204 L 84 176 Z" vectorEffect="non-scaling-stroke" />
      </g>

      <g className="p-dims" opacity="0" fontFamily="ui-sans-serif, system-ui, Arial, sans-serif" fontSize="15" fontWeight="600">
        <g className="p-dim-w" stroke="var(--p-dim-w, #1455ff)" fill="var(--p-dim-w, #1455ff)">
          <line className="p-dim-line" x1="74" y1="86" x2="312" y2="62" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <text className="p-dim-label" x="186" y="58" stroke="none">W</text>
        </g>

        <g className="p-dim-h" stroke="var(--p-dim-h, #9b2fb0)" fill="var(--p-dim-h, #9b2fb0)">
          <line className="p-dim-line" x1="62" y1="101" x2="62" y2="178" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <text className="p-dim-label" x="38" y="144" stroke="none">H</text>
        </g>

        <g className="p-dim-l" stroke="var(--p-dim-l, #0a8a22)" fill="var(--p-dim-l, #0a8a22)">
          <line className="p-dim-line" x1="104" y1="228" x2="342" y2="204" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <text className="p-dim-label" x="216" y="242" stroke="none">L</text>
        </g>
      </g>

      <g className="p-accents" opacity="0">
        <line x1="118" y1="132" x2="326" y2="111" stroke="var(--p-accent, #df7a12)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  )
}
