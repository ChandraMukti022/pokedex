type PokeballTone = 'color' | 'gray' | 'light'

const TONES: Record<PokeballTone, { top: string; bottom: string; stroke: string; button: string }> =
  {
    color: {
      top: 'fill-red-500',
      bottom: 'fill-white',
      stroke: 'stroke-gray-800',
      button: 'fill-white',
    },
    gray: {
      top: 'fill-gray-400',
      bottom: 'fill-gray-200',
      stroke: 'stroke-gray-500',
      button: 'fill-gray-100',
    },
    light: {
      top: 'fill-white/70',
      bottom: 'fill-white/30',
      stroke: 'stroke-white',
      button: 'fill-white/50',
    },
  }

interface PokeballProps {
  tone?: PokeballTone
  className?: string
}

export default function Pokeball({ tone = 'color', className = '' }: PokeballProps) {
  const t = TONES[tone]

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      {/* Bagian bawah (dasar bola) */}
      <circle cx="50" cy="50" r="46" strokeWidth="6" className={`${t.bottom} ${t.stroke}`} />
      {/* Bagian atas (setengah lingkaran) */}
      <path d="M4 50 A46 46 0 0 1 96 50 Z" className={t.top} />
      {/* Garis luar dan garis tengah */}
      <circle cx="50" cy="50" r="46" strokeWidth="6" className={`fill-none ${t.stroke}`} />
      <line x1="4" y1="50" x2="96" y2="50" strokeWidth="6" className={t.stroke} />
      {/* Tombol di tengah */}
      <circle cx="50" cy="50" r="13" strokeWidth="6" className={`${t.button} ${t.stroke}`} />
    </svg>
  )
}
