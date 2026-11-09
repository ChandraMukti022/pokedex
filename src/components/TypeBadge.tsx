import { formatName } from '../utils/pokemon'

const TYPE_COLORS: Record<string, string> = {
  normal: 'bg-gray-400 text-white',
  fire: 'bg-orange-500 text-white',
  water: 'bg-blue-500 text-white',
  electric: 'bg-yellow-400 text-gray-900',
  grass: 'bg-green-500 text-white',
  ice: 'bg-cyan-300 text-gray-900',
  fighting: 'bg-red-700 text-white',
  poison: 'bg-purple-500 text-white',
  ground: 'bg-amber-600 text-white',
  flying: 'bg-indigo-400 text-white',
  psychic: 'bg-pink-500 text-white',
  bug: 'bg-lime-500 text-white',
  rock: 'bg-stone-500 text-white',
  ghost: 'bg-violet-700 text-white',
  dragon: 'bg-indigo-700 text-white',
  dark: 'bg-gray-700 text-white',
  steel: 'bg-slate-500 text-white',
  fairy: 'bg-pink-400 text-white',
}

interface TypeBadgeProps {
  type: string
}

export default function TypeBadge({ type }: TypeBadgeProps) {
  const color = TYPE_COLORS[type] ?? 'bg-gray-400 text-white'

  return (
    <span className={`rounded-full px-3 py-1 text-sm font-medium ${color}`}>
      {formatName(type)}
    </span>
  )
}