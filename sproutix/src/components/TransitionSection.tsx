import DecorativeLines from './DecorativeLines'

/**
 * The cinematic bridge between the light hero and the dark About section.
 * A gradient crossfade + organic arc lines emphasise the scene change.
 */
export default function TransitionSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        height: '40vh',
        background:
          'linear-gradient(to bottom, #c6ccd5 0%, #6a6070 30%, #1a1020 65%, #0a0a0a 100%)',
      }}
    >
      {/* Soft white arcs drifting across the gradient */}
      <DecorativeLines color="rgba(255,255,255,0.10)" animated />

      {/* Purple accent sweep */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M-5 80 Q 30 50, 65 55 T 105 25"
          fill="none"
          stroke="rgba(123, 94, 167, 0.25)"
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M-5 95 Q 40 60, 70 65 T 105 40"
          fill="none"
          stroke="rgba(106, 191, 94, 0.12)"
          strokeWidth="0.4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Vignette edge fade */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 100% at 50% 100%, transparent 60%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </section>
  )
}
