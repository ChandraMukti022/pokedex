import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { PokemonSummary } from '../types/pokemon'
import FeaturedPokemon from './FeaturedPokemon'
import PageLoader from './PageLoader'
import ErrorState from './ErrorState'

const ROTATE_MS = 6000 // ganti slide otomatis tiap 6 detik

interface HomeHeroProps {
  pokemons: PokemonSummary[]
  isPending: boolean
  errorMessage?: string
  onRetry: () => void
}

export default function HomeHero({ pokemons, isPending, errorMessage, onRetry }: HomeHeroProps) {
  const navigate = useNavigate()

  // Local state: kata kunci, slide aktif, dan jeda saat kursor di atas hero
  const [keyword, setKeyword] = useState('')
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  // Pindah slide otomatis. Timer dibuat ulang tiap slide berganti (termasuk klik titik).
  useEffect(() => {
    if (paused || pokemons.length < 2) return
    const timer = setTimeout(() => setCurrent((i) => (i + 1) % pokemons.length), ROTATE_MS)
    return () => clearTimeout(timer)
  }, [current, paused, pokemons.length])

  // Kirim kata kunci ke halaman Jelajahi (disimpan di URL sebagai ?q=...)
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = keyword.trim()
    navigate(trimmed ? `/pokedex?q=${encodeURIComponent(trimmed)}` : '/pokedex')
  }

  function scrollToTypes() {
    document.getElementById('jelajah')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      // Full-bleed + naik ke belakang navbar (-mt-20 = navbar 4rem + padding main 1rem)
      className="relative isolate -mt-20 ml-[calc(50%-50vw)] flex min-h-svh w-screen flex-col bg-linear-to-br from-gray-200 to-gray-100"
      onPointerEnter={(event) => event.pointerType === 'mouse' && setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pt-24">
        {/* Search di tengah atas, menyatu dengan hero */}
        <form
          onSubmit={handleSubmit}
          className="relative z-10 mx-auto flex w-full max-w-2xl gap-2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur focus-within:ring-2 focus-within:ring-gray-900/30"
        >
          <input
            type="search"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Cari dari 1025 Pokémon..."
            aria-label="Cari Pokémon"
            className="min-w-0 flex-1 bg-transparent px-4 py-2 text-base focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-gray-900 px-6 py-2.5 font-semibold text-white transition hover:bg-gray-700"
          >
            Cari
          </button>
        </form>

        {/* Slide ditumpuk di sel grid yang sama, lalu di-crossfade */}
        <div className="grid flex-1 items-center py-8">
          {isPending && (
            <div className="relative z-10 col-start-1 row-start-1">
              <PageLoader label="Memuat Pokémon..." />
            </div>
          )}
          {errorMessage && (
            <div className="relative z-10 col-start-1 row-start-1">
              <ErrorState message={errorMessage} onRetry={onRetry} />
            </div>
          )}
          {pokemons.map((pokemon, index) => (
            <FeaturedPokemon key={pokemon.id} pokemon={pokemon} active={index === current} />
          ))}
        </div>

        {/* Penanda slide (bisa diklik) */}
        {pokemons.length > 1 && (
          <div className="relative z-10 flex justify-center gap-2 pb-24">
            {pokemons.map((pokemon, index) => (
              <button
                key={pokemon.id}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Tampilkan ${pokemon.name}`}
                aria-current={index === current}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === current ? 'w-8 bg-gray-900' : 'w-2.5 bg-black/25 hover:bg-black/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Transisi halus ke bagian bawah halaman */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-linear-to-b from-transparent to-gray-50" />
      <button
        type="button"
        onClick={scrollToTypes}
        className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        Jelajahi type
        <svg
          viewBox="0 0 24 24"
          className="mt-0.5 h-5 w-5 animate-bounce"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </section>
  )
}
