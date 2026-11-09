import { Link } from 'react-router-dom'
import type { PokemonSummary } from '../types/pokemon'
import { buildImageUrl, formatId, formatName } from '../utils/pokemon'

interface PokemonCardProps {
  pokemon: PokemonSummary
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      className="block rounded-xl bg-white p-4 shadow transition hover:-translate-y-1 hover:shadow-md"
    >
      <img
        src={buildImageUrl(pokemon.id)}
        alt={formatName(pokemon.name)}
        loading="lazy"
        className="aspect-square w-full object-contain"
      />
      <p className="mt-2 text-sm text-gray-500">{formatId(pokemon.id)}</p>
      <h2 className="font-semibold">{formatName(pokemon.name)}</h2>
    </Link>
  )
}