import { useState } from 'react'
import { formatName } from '../utils/pokemon'
import { getTypeIconUrl } from '../utils/typeIcons'

interface TypeBadgeProps {
  type: string
  className?: string // atur ukuran lewat tinggi, mis. "h-7"
}

// Label type resmi dari PokéAPI sprites. Kalau gambar tidak tersedia, pakai teks biasa.
export default function TypeBadge({ type, className = 'h-7' }: TypeBadgeProps) {
  const [failed, setFailed] = useState(false)
  const url = getTypeIconUrl(type)

  if (!url || failed) {
    return (
      <span className="rounded-full bg-gray-500 px-3 py-1 text-sm font-medium text-white">
        {formatName(type)}
      </span>
    )
  }

  return (
    <img
      src={url}
      alt={formatName(type)}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  )
}
