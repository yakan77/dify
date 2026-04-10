'use client'
import { useRef } from 'react'
import { useInView } from '@/hooks/useScrollProgress'

interface PortfolioItem {
  id: number
  label: string
  /** Two stops for the radial gradient */
  gradient: [string, string]
  /** Inline SVG path for the icon */
  iconPath: string
}

const ITEMS: PortfolioItem[] = [
  {
    id: 1,
    label: 'Bloom',
    gradient: ['#4a2080', '#7b3fb5'],
    iconPath: 'M12 4C9 4 7 6.5 7 9c0 3 2.5 5 5 7 2.5-2 5-4 5-7 0-2.5-2-5-5-5z',
  },
  {
    id: 2,
    label: 'Cosmos',
    gradient: ['#12245a', '#2045a0'],
    iconPath:
      'M12 2l1.5 4.5H18l-3.75 2.75L15.75 14 12 11.25 8.25 14l1.5-4.75L6 6.5h4.5L12 2z',
  },
  {
    id: 3,
    label: 'Forest',
    gradient: ['#0f3020', '#1e6040'],
    iconPath: 'M12 3L5 15h4v4h6v-4h4L12 3z M12 9v6',
  },
  {
    id: 4,
    label: 'Aurora',
    gradient: ['#250a4a', '#6022a0'],
    iconPath:
      'M3 12 Q6 6 12 8 Q18 10 21 12 Q18 16 12 14 Q6 18 3 12z',
  },
  {
    id: 5,
    label: 'Ember',
    gradient: ['#3a0a0a', '#8a2222'],
    iconPath:
      'M12 3C10 7 8 8 9 12c1 3 5 6 3 9 3-2 6-5 6-9 0-5-4-6-6-9z',
  },
  {
    id: 6,
    label: 'Drift',
    gradient: ['#0a1a2e', '#1a3a6a'],
    iconPath:
      'M4 12 Q8 8 12 12 Q16 16 20 12 M4 8 Q8 4 12 8 Q16 12 20 8',
  },
]

function ThumbnailCard({ item, delay }: { item: PortfolioItem; delay: number }) {
  return (
    <div
      className="
        w-20 h-20 rounded-2xl cursor-pointer
        border border-white/10
        flex flex-col items-center justify-center gap-1.5
        transition-all duration-300
        hover:scale-110 hover:border-purple-400/40
        animate-pop-in
      "
      style={{
        background: `radial-gradient(circle at 35% 35%, ${item.gradient[1]}cc, ${item.gradient[0]}aa)`,
        animationDelay: `${delay}s`,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.boxShadow =
          '0 0 20px rgba(123,94,167,0.45), inset 0 1px 0 rgba(255,255,255,0.1)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.boxShadow =
          'inset 0 1px 0 rgba(255,255,255,0.07)'
      }}
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(255,255,255,0.8)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={item.iconPath} />
      </svg>
      <span className="text-[8px] text-white/40 uppercase tracking-widest font-semibold">
        {item.label}
      </span>
    </div>
  )
}

export default function PortfolioGrid() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref as React.RefObject<Element | null>)

  return (
    <div ref={ref} className={`transition-opacity duration-700 ${inView ? 'opacity-100' : 'opacity-0'}`}>
      <p className="text-center text-[10px] text-white/25 uppercase tracking-[0.18em] font-semibold mb-5">
        Selected Works
      </p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {ITEMS.map((item, i) => (
          <ThumbnailCard key={item.id} item={item} delay={inView ? 0.05 + i * 0.07 : 0} />
        ))}
      </div>
    </div>
  )
}
