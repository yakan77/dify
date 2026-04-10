import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import TransitionSection from '@/components/TransitionSection'
import AboutVision from '@/components/AboutVision'

export default function Home() {
  return (
    /*
     * Outer wrapper: black side-rails give the cinematic "letterbox"
     * effect at wide viewports while the content fills the centre.
     */
    <div className="bg-[#111111] min-h-screen">
      <Navbar />
      <Hero />
      <TransitionSection />
      <AboutVision />

      {/* Footer strip */}
      <footer className="bg-[#0a0a0a] border-t border-white/5 py-8 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-white/40 text-sm">
          <span className="font-black text-white/60">Sprou</span>
          <span className="font-light text-white/30">tix</span>
          <span className="mx-2 text-white/15">·</span>
          <span>3D Animation Studio</span>
        </div>
        <p className="text-white/25 text-xs">
          © {new Date().getFullYear()} Sproutix. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
