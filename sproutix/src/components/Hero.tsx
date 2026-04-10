'use client'
import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { useSectionProgress } from '@/hooks/useScrollProgress'
import DecorativeLines from './DecorativeLines'

const FlowerScene = dynamic(() => import('./FlowerScene'), { ssr: false })

const PROCESS_STEPS = [
  {
    label: 'SOWING',
    desc: 'Ideas take root through deep research and creative vision.',
  },
  {
    label: 'SPROUT',
    desc: 'Concepts emerge as rough 3D sketches and motion storyboards.',
  },
  {
    label: 'GROW',
    desc: 'Refinement through iteration, lighting, and AI enhancement.',
  },
  {
    label: 'BLOOM',
    desc: 'Final renders delivered with cinematic quality and motion.',
  },
]

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const bloomProgress = useSectionProgress(sectionRef)

  return (
    /*
     * Section is 200vh — provides a ~100vh scroll runway while
     * the sticky viewport content remains in view, allowing the
     * 3D flower bloom to animate smoothly 0 → 1.
     */
    <section
      ref={sectionRef}
      className="relative"
      style={{
        minHeight: '200vh',
        background: 'linear-gradient(160deg, #eaecf0 0%, #d4d8df 45%, #c6ccd5 100%)',
      }}
    >
      <DecorativeLines color="rgba(26,26,46,0.055)" />

      {/* Sticky viewport layer */}
      <div className="sticky top-0 h-screen flex flex-col justify-between pt-24 pb-10 overflow-hidden">
        {/* ── Headline + 3D flower ── */}
        <div className="flex-1 flex items-center justify-center relative">
          {/* Text — below flower in z order intentionally */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none select-none px-4">
            <p
              className="font-serif text-[clamp(32px,5.5vw,72px)] font-light text-[#1a1a2e]/65 leading-none animate-fade-in-up"
              style={{ animationDelay: '0.1s' }}
            >
              We grow
            </p>
            <p
              className="font-sans text-[clamp(44px,9.5vw,120px)] font-black text-[#1a1a2e] leading-none tracking-tight -mt-1 animate-fade-in-up"
              style={{ animationDelay: '0.25s' }}
            >
              3D ANIMATION
            </p>
            <p
              className="font-serif italic text-[clamp(28px,5vw,68px)] font-light text-[#1a1a2e]/55 leading-none -mt-1 animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              with AI
            </p>
          </div>

          {/* 3D Flower — overlapping the text, interactive */}
          <div className="relative z-10 w-[min(520px,82vw)] h-[min(520px,82vw)]">
            <FlowerScene bloomProgress={bloomProgress} darkMode={false} />
          </div>
        </div>

        {/* ── Process steps ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 px-8 md:px-16 border-t border-[#1a1a2e]/10 pt-6">
          {PROCESS_STEPS.map((step, i) => (
            <div
              key={step.label}
              className="animate-fade-in-up"
              style={{ animationDelay: `${0.55 + i * 0.1}s` }}
            >
              <p className="text-[11px] text-[#1a1a2e]/45 font-light leading-snug max-w-[170px] mb-1.5">
                {step.desc}
              </p>
              <p className="text-sm font-black uppercase tracking-[0.08em] text-[#1a1a2e]">
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
