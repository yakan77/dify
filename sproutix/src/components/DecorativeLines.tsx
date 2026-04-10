interface DecorativeLinesProps {
  className?: string
  color?: string
  animated?: boolean
}

/**
 * Full-bleed SVG overlay of flowing organic arc lines.
 * Rendered as a static layer; CSS animation is optional.
 */
export default function DecorativeLines({
  className = '',
  color = 'rgba(255,255,255,0.12)',
  animated = false,
}: DecorativeLinesProps) {
  const style = animated
    ? { animation: 'driftH 18s ease-in-out infinite alternate' }
    : undefined

  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none overflow-visible ${className}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={style}
    >
      <defs>
        <filter id="dl-blur">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>

      {/* Sweeping horizontal arcs */}
      <path
        d="M-200 30% Q 20% 18%, 50% 28% T 120% 22%"
        fill="none"
        stroke={color}
        strokeWidth="1"
        filter="url(#dl-blur)"
      />
      <path
        d="M-200 45% Q 25% 32%, 55% 44% T 120% 38%"
        fill="none"
        stroke={color}
        strokeWidth="0.8"
        filter="url(#dl-blur)"
      />
      <path
        d="M-200 62% Q 30% 50%, 60% 60% T 120% 55%"
        fill="none"
        stroke={color}
        strokeWidth="1.2"
        filter="url(#dl-blur)"
      />
      <path
        d="M-200 75% Q 35% 65%, 65% 74% T 120% 70%"
        fill="none"
        stroke={color}
        strokeWidth="0.7"
        filter="url(#dl-blur)"
      />

      {/* Vertical soft arcs */}
      <path
        d="M 18% -10% Q 22% 30%, 15% 60% T 20% 110%"
        fill="none"
        stroke={color}
        strokeWidth="0.8"
        filter="url(#dl-blur)"
      />
      <path
        d="M 82% -10% Q 78% 35%, 85% 65% T 80% 110%"
        fill="none"
        stroke={color}
        strokeWidth="0.7"
        filter="url(#dl-blur)"
      />
    </svg>
  )
}
