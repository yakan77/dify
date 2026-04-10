interface CTAButtonProps {
  label?: string
  href?: string
  onClick?: () => void
  className?: string
}

export default function CTAButton({
  label = 'Learn More',
  href,
  onClick,
  className = '',
}: CTAButtonProps) {
  const base = `
    inline-flex items-center gap-2.5
    bg-white text-[#1a1a2e]
    rounded-full px-5 py-2.5
    text-sm font-medium
    transition-all duration-300
    hover:scale-105 hover:shadow-xl hover:shadow-white/20
    cursor-pointer select-none
    ${className}
  `

  const inner = (
    <>
      {label}
      <span className="w-6 h-6 rounded-full bg-[#1a1a2e] flex items-center justify-center flex-shrink-0">
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path
            d="M2 6h8M6 2l4 4-4 4"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </>
  )

  if (href) {
    return (
      <a href={href} className={base}>
        {inner}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={base}>
      {inner}
    </button>
  )
}
