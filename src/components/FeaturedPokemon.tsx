import { Link } from 'react-router-dom'
import type { PokemonSummary } from '../types/pokemon'
import { usePokemonDetail } from '../hooks/usePokemonDetail'
import { getCardStyle } from '../utils/typeStyles'
import { buildImageUrl, formatHeight, formatId, formatName, formatWeight } from '../utils/pokemon'
import FavoriteButton from './FavoriteButton'
import TypeBadge from './TypeBadge'

interface FeaturedPokemonProps {
  pokemon: PokemonSummary
  active: boolean // true = slide yang sedang tampil
}

// Satu slide di hero beranda: latar warna type + info + gambar besar.
// Fragment ini harus ada di dalam wadah grid HomeHero (latar mengisi seluruh hero).
export default function FeaturedPokemon({ pokemon, active }: FeaturedPokemonProps) {
  const name = formatName(pokemon.name)
  const { data } = usePokemonDetail(pokemon.id)

  const style = getCardStyle(data?.types[0]?.type.name)
  const hp = data?.stats.find((item) => item.stat.name === 'hp')?.base_stat

  return (
    <>
      {/* Latar: slide baru muncul dulu, baru slide lama menghilang (tanpa kedip abu-abu) */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-linear-to-br transition-opacity duration-700 ${style.art} ${
          active ? 'z-1 opacity-100' : 'z-0 opacity-0 delay-700'
        }`}
      />

      <div
        aria-hidden={!active}
        className={`relative z-10 col-start-1 row-start-1 grid items-center gap-6 transition-[opacity,visibility] duration-700 sm:grid-cols-2 ${
          active ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div className="order-2 sm:order-1">
          <p className="text-sm font-semibold text-gray-600">{formatId(pokemon.id)}</p>
          <h2 className="mt-1 text-5xl font-extrabold tracking-tight sm:text-7xl">{name}</h2>

          <div className="mt-5 flex min-h-8 flex-wrap gap-2">
            {data?.types.map((item) => (
              <TypeBadge key={item.type.name} type={item.type.name} className="h-8" />
            ))}
          </div>

          {data ? (
            <dl className="mt-6 flex gap-8 text-sm">
              <div>
                <dt className="text-gray-600">Tinggi</dt>
                <dd className="text-xl font-bold">{formatHeight(data.height)}</dd>
              </div>
              <div>
                <dt className="text-gray-600">Berat</dt>
                <dd className="text-xl font-bold">{formatWeight(data.weight)}</dd>
              </div>
              {hp !== undefined && (
                <div>
                  <dt className="text-gray-600">HP</dt>
                  <dd className="text-xl font-bold">{hp}</dd>
                </div>
              )}
            </dl>
          ) : (
            <div className="mt-6 h-14 w-64 animate-pulse rounded bg-black/10" />
          )}

          <div className="mt-8 flex items-center gap-3">
            <Link
              to={`/pokemon/${pokemon.id}`}
              className="rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-700"
            >
              Lihat detail
            </Link>
            <FavoriteButton pokemonId={pokemon.id} pokemonName={name} className="h-12 w-12" />
          </div>
        </div>

        <img
          src={buildImageUrl(pokemon.id)}
          alt={name}
          className="order-1 mx-auto h-56 w-56 object-contain drop-shadow-2xl sm:order-2 sm:h-80 sm:w-80 lg:h-[26rem] lg:w-[26rem]"
        />
      </div>
    </>
  )
}
