interface R001DiagramHole {
  id: number
  shape: 'round' | 'rectangular'
  side: 'top' | 'bottom' | 'left' | 'right'
  position: number
}

interface R001ProductDiagramProps {
  diameter: number
  length: number
  holes?: R001DiagramHole[]
}

export function R001ProductDiagram({ diameter, length, holes = [] }: R001ProductDiagramProps) {
  const markX = (position: number) => 120 + Math.min(0.94, Math.max(0.06, position / Math.max(length, 1))) * 300

  return (
    <svg viewBox="0 0 520 300" role="img" aria-label={`Труба прямошовная D ${diameter}, L ${length}`}>
      <ellipse cx="266" cy="238" rx="176" ry="12" fill="#1f2328" opacity="0.07" />
      <path d="M 104 96 L 424 96 A 21 56 0 0 1 424 208 L 104 208 Z" fill="#f4f6f8" />
      <ellipse cx="104" cy="152" rx="21" ry="56" fill="#e8ebee" />
      <ellipse cx="106" cy="152" rx="17.5" ry="51" fill="#1f2328" opacity="0.05" />
      <g stroke="#4d5156" fill="none" strokeWidth="1.25" opacity="0.45">
        <ellipse cx="104" cy="152" rx="18" ry="53" />
        <path d="M 424 100 A 17 53 0 0 1 424 204" />
        <line x1="118" y1="101" x2="420" y2="101" />
        <line x1="118" y1="105" x2="420" y2="105" />
      </g>
      <line x1="118" y1="103" x2="420" y2="103" stroke="#df7a12" strokeWidth="1.6" opacity="0.7" />
      <g stroke="#4d5156" fill="none" strokeWidth="2" strokeLinecap="round">
        <line x1="104" y1="96" x2="424" y2="96" />
        <line x1="104" y1="208" x2="424" y2="208" />
        <path d="M 424 96 A 21 56 0 0 1 424 208" />
        <ellipse cx="104" cy="152" rx="21" ry="56" />
      </g>
      {holes.map((hole) => {
        const x = markX(hole.position)
        const y = hole.side === 'bottom' ? 206 : hole.side === 'top' ? 98 : 152
        return hole.shape === 'rectangular' ? (
          <rect key={hole.id} x={x - 13} y={y - 8} width="26" height="16" rx="2" fill="#fff8ec" stroke="#df7a12" strokeWidth="2.5" />
        ) : (
          <circle key={hole.id} cx={x} cy={y} r="10" fill="#fff8ec" stroke="#df7a12" strokeWidth="2.5" />
        )
      })}
      <g stroke="#1455ff" fill="#1455ff" fontSize="17" fontWeight="700">
        <line x1="98" y1="96" x2="56" y2="96" strokeWidth="1" />
        <line x1="98" y1="208" x2="56" y2="208" strokeWidth="1" />
        <line x1="60" y1="105" x2="60" y2="199" strokeWidth="1" />
        <polygon points="60,96 56,106 64,106" stroke="none" />
        <polygon points="60,208 56,198 64,198" stroke="none" />
        <text x="14" y="158" stroke="none">D {diameter}</text>
      </g>
      <g stroke="#0a8a22" fill="#0a8a22" fontSize="17" fontWeight="700">
        <line x1="104" y1="216" x2="104" y2="262" strokeWidth="1" />
        <line x1="424" y1="216" x2="424" y2="262" strokeWidth="1" />
        <line x1="114" y1="256" x2="414" y2="256" strokeWidth="1" />
        <polygon points="104,256 114,252 114,260" stroke="none" />
        <polygon points="424,256 414,252 414,260" stroke="none" />
        <text x="240" y="249" stroke="none">L {length}</text>
      </g>
    </svg>
  )
}
