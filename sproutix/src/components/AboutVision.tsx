'use client'
import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { useInView } from '@/hooks/useScrollProgress'
import PortfolioGrid from './PortfolioGrid'
import DecorativeLines from './DecorativeLines'

const FlowerScene = dynamic(() => import('./FlowerScene'), { ssr: false })

/** Animated headline — words fade in as the section enters view. */
function AnimatedQuote({ inView }: { inView: boolean }) {
  // Segments: [text, style class]
  type Segment = [string, string]
  const segments: Segment[] = [
    ['We create visuals where ', 'text-white/80 font-light'],
    ['ideas bloom in motion,', 'text-white font-bold'],
    [' blending ', 'text-white/80 font-light'],
    ['AI, design,', 'text-purple-300 italic font-light'],
    [' and storytelling into ', 'text-white/80 font-light'],
    ['3D animations', 'text-white font-bold'],
    [' that feel alive and ', 'text-white/80 font-light'],
    ['truly stand out.', 'text-purple-200 italic'],
  ]

  return (
    <p className="font-serif text-[clamp(18px,2.6vw,30px)] leading-relaxed text-center max-w-4xl mx-auto">
      {segments.map(([text, cls], i) => (
        <span
          key={i}
          className={`${cls} inline transition-all duration-700`}
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'none' : 'translateY(10px)',
            transitionDelay: inView ? `${0.1 + i * 0.07}s` : '0s',
          }}
        >
          {text}
        </span>
      ))}
    </p>
  )
}

export default function AboutVision() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef as React.RefObject<Element | null>, { threshold: 0.1 })

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative min-h-screen bg-[#0a0a0a] overflow-hidden
                 flex flex-col items-center justify-center gap-16
                 px-6 md:px-12 py-28"
    >
      {/* Subtle dark arc lines */}
      <DecorativeLines color="rgba(255,255,255,0.04)" />

      {/* Deep purple radial glow behind the flower */}
      <div
        className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(100,60,180,0.18) 0%, rgba(60,20,120,0.08) 50%, transparent 70%)',
          filter: 'blur(48px)',
        }}
      />

      {/* Decorative corner circle strokes */}
      <svg
        className="absolute top-0 right-0 pointer-events-none opacity-20"
        width="300"
        height="300"
        viewBox="0 0 300 300"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="300" cy="0" r="220" stroke="rgba(123,94,167,0.4)" strokeWidth="1" />
        <circle cx="300" cy="0" r="170" stroke="rgba(123,94,167,0.25)" strokeWidth="0.7" />
      </svg>
      <svg
        className="absolute bottom-0 left-0 pointer-events-none opacity-20"
        width="280"
        height="280"
        viewBox="0 0 280 280"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="0" cy="280" r="200" stroke="rgba(106,191,94,0.3)" strokeWidth="1" />
      </svg>

      {/* ── Vision quote ── */}
      <div className="relative z-10 w-full">
        <AnimatedQuote inView={inView} />
      </div>

      {/* ── 3D Rose (fully bloomed, dramatic dark mode) ── */}
      <div className="relative z-10 w-[min(380px,80vw)] h-[min(380px,80vw)]">
        <FlowerScene bloomProgress={1} darkMode className="w-full h-full" />

        {/* Lens-flare accent */}
        <div
          className="absolute top-[22%] right-[22%] w-28 h-28 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(200,170,255,0.5) 0%, transparent 65%)',
            filter: 'blur(22px)',
          }}
        />
        <div
          className="absolute bottom-[25%] left-[28%] w-20 h-20 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(106,191,94,0.3) 0%, transparent 65%)',
            filter: 'blur(18px)',
          }}
        />
      </div>

      {/* ── Portfolio thumbnails ── */}
      <div className="relative z-10 w-full max-w-xl">
        <PortfolioGrid />
      </div>
    </section>
  )
}
