import { Link } from 'react-router-dom'
import type { PokemonSummary } from '../types/pokemon'
import { buildImageUrl, formatId, formatName } from '../utils/pokemon'
import FavoriteButton from './FavoriteButton'

interface PokemonCardProps {
  pokemon: PokemonSummary
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const name = formatName(pokemon.name)

  return (
    <div className="relative transition hover:-translate-y-1">
      <Link
        to={`/pokemon/${pokemon.id}`}
        className="block rounded-xl bg-white p-4 shadow hover:shadow-md"
      >
        <img
          src={buildImageUrl(pokemon.id)}
          alt={name}
          loading="lazy"
          className="aspect-square w-full object-contain"
        />
        <p className="mt-2 text-sm text-gray-500">{formatId(pokemon.id)}</p>
        <h2 className="font-semibold">{name}</h2>
      </Link>

      <FavoriteButton
        pokemonId={pokemon.id}
        pokemonName={name}
        className="absolute right-2 top-2 h-9 w-9"
      />
    </div>
  )
}