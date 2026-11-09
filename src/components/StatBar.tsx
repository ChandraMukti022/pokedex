import { formatStatName } from '../utils/pokemon'

const MAX_BASE_STAT = 255

interface StatBarProps {
  name: string
  value: number
}

export default function StatBar({ name, value }: StatBarProps) {
  const percent = Math.min((value / MAX_BASE_STAT) * 100, 100)

  return (
    <div className="flex items-center gap-3">
      <span className="w-16 shrink-0 text-sm text-gray-500">{formatStatName(name)}</span>
      <span className="w-8 shrink-0 text-right text-sm font-semibold">{value}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
        <div className="h-full rounded-full bg-blue-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}