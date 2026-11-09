import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePokemonIndex } from '../hooks/usePokemonIndex'
import { useTypes } from '../hooks/useTypes'
import HomeHero from '../components/HomeHero'
import PokemonCard from '../components/PokemonCard'
import TypeBadge from '../components/TypeBadge'
import ErrorState from '../components/ErrorState'
import { MAX_POKEMON_ID } from '../utils/pokemon'

const HERO_COUNT = 6 // Pokémon yang berganti-ganti di hero
const CARD_COUNT = 8 // kartu "Pilihan acak" di bawahnya

// Pilih beberapa ID acak yang berbeda
function pickRandomIds(count: number): number[] {
  const picked = new Set<number>()
  while (picked.size < count) {
    picked.add(Math.floor(Math.random() * MAX_POKEMON_ID) + 1)
  }
  return [...picked]
}

export default function HomePage() {
  // Local state: ID acak, dibuat sekali tiap kunjungan ke beranda
  const [randomIds] = useState(() => pickRandomIds(HERO_COUNT + CARD_COUNT))

  const indexQuery = usePokemonIndex()
  const typesQuery = useTypes()

  // ID -> data ringkas, supaya nama bisa dicari dari ID acak
  const byId = useMemo(
    () => new Map((indexQuery.data ?? []).map((pokemon) => [pokemon.id, pokemon])),
    [indexQuery.data],
  )
  const picks = randomIds.flatMap((id) => byId.get(id) ?? [])
  const heroPokemons = picks.slice(0, HERO_COUNT)
  const cardPokemons = picks.slice(HERO_COUNT)

  return (
    <div>
      {/* ===== Hero full layar (search + Pokémon berganti otomatis) ===== */}
      <HomeHero
        pokemons={heroPokemons}
        isPending={indexQuery.isPending}
        errorMessage={indexQuery.isError ? indexQuery.error.message : undefined}
        onRetry={() => indexQuery.refetch()}
      />

      <div className="space-y-12 pb-8 pt-10">
        {/* ===== Type sebagai chip ===== */}
        <section id="jelajah" className="scroll-mt-20">
          <h2 className="mb-4 text-center text-2xl font-bold">Jelajahi berdasarkan type</h2>

          {typesQuery.isError && (
            <ErrorState message={typesQuery.error.message} onRetry={() => typesQuery.refetch()} />
          )}

          {typesQuery.isPending && (
            <div className="flex flex-wrap justify-center gap-2" aria-hidden="true">
              {Array.from({ length: 18 }, (_, i) => (
                <div key={i} className="h-8 w-36 animate-pulse rounded-full bg-gray-200" />
              ))}
            </div>
          )}

          {typesQuery.data && (
            <ul className="flex flex-wrap justify-center gap-2">
              {typesQuery.data.map((type) => (
                <li key={type}>
                  <Link
                    to={`/pokedex?type=${type}`}
                    className="block rounded-full transition hover:-translate-y-0.5 hover:drop-shadow-md"
                  >
                    <TypeBadge type={type} className="h-8" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ===== Pilihan acak ===== */}
        {cardPokemons.length > 0 && (
          <section>
            <h2 className="mb-4 text-center text-2xl font-bold">Pilihan acak</h2>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {cardPokemons.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/pokedex"
                className="group inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 font-semibold text-white shadow transition hover:bg-gray-700"
              >
                Lihat semua Pokémon
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 transition group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
