'use client'
import { useState, useEffect } from 'react'
import CTAButton from './CTAButton'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Team', href: '#team' },
  { label: 'Roadmap', href: '#roadmap' },
  { label: 'Contact', href: '#contact' },
  { label: 'Token', href: '#token' },
]

/** Logo mark — a stylised sprouting seed. */
function LogoMark({ dark }: { dark: boolean }) {
  return (
    <div
      className={`w-7 h-7 rounded-[10px] flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${
        dark ? 'bg-[#7b5ea7]' : 'bg-[#1a1a2e]'
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 3C5.8 3 4 4.8 4 7c0 2.4 2 3.8 4 5.8 2-2 4-3.4 4-5.8 0-2.2-1.8-4-4-4z" fill="white" />
        <path d="M8 7v6" stroke="#6abf5e" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export default function Navbar() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const threshold = window.innerHeight * 1.3
    const onScroll = () => setIsDark(window.scrollY > threshold)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
        flex items-center justify-between
        px-6 md:px-10 py-4
        transition-colors duration-500
        ${isDark ? 'text-white' : 'text-[#1a1a2e]'}
      `}
    >
      {/* Brand */}
      <a href="#" className="flex items-center gap-2.5 no-underline">
        <LogoMark dark={isDark} />
        <span className="text-lg leading-none">
          <span className="font-black">Sprou</span>
          <span className={`font-light transition-colors duration-500 ${isDark ? 'text-white/70' : 'text-[#1a1a2e]/60'}`}>
            tix
          </span>
        </span>
      </a>

      {/* Centre pill */}
      <div
        className={`
          hidden md:flex items-center gap-7
          px-7 py-2.5 rounded-full
          transition-all duration-500
          ${isDark ? 'nav-pill-dark text-white/85' : 'nav-pill text-[#1a1a2e]/80'}
        `}
      >
        {NAV_LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="text-sm transition-opacity duration-200 hover:opacity-60"
          >
            {label}
          </a>
        ))}
      </div>

      {/* CTA */}
      <CTAButton label="Learn More" href="#features" />
    </nav>
  )
}
