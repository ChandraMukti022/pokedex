import { formatName } from '../utils/pokemon'
import TypeBadge from './TypeBadge'

interface TypeFilterProps {
  types: string[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

// Filter type: grid rapi (18 type = 6 kolom x 3 baris). Klik type aktif lagi untuk membatalkan.
export default function TypeFilter({ types, value, onChange, disabled }: TypeFilterProps) {
  const gridClass = 'grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6'

  // Saat daftar type belum datang: kerangka supaya header tidak melompat
  if (disabled && types.length === 0) {
    return (
      <div className={gridClass} aria-hidden="true">
        {Array.from({ length: 18 }, (_, i) => (
          <div key={i} className="aspect-[5/1] animate-pulse rounded-full bg-white/50" />
        ))}
      </div>
    )
  }

  return (
    <div role="group" aria-label="Filter berdasarkan type" className={gridClass}>
      {types.map((type) => {
        const isActive = value === type

        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(isActive ? '' : type)}
            disabled={disabled}
            aria-pressed={isActive}
            aria-label={formatName(type)}
            className={`rounded-full transition disabled:opacity-50 ${
              isActive
                ? 'ring-2 ring-gray-900 ring-offset-2'
                : value
                  ? 'opacity-60 hover:-translate-y-0.5 hover:opacity-100'
                  : 'hover:-translate-y-0.5'
            }`}
          >
            <TypeBadge type={type} className="aspect-[5/1] w-full" />
          </button>
        )
      })}
    </div>
  )
}
