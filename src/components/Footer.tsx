import { Link } from 'react-router-dom'
import Pokeball from './Pokeball'
import { getTypeLabel } from '../utils/typeLabels'

// Type yang ditampilkan sebagai tautan cepat (nilainya harus sama dengan nama type di PokéAPI)
const QUICK_TYPES = ['fire', 'water', 'grass', 'electric', 'psychic', 'dragon']

const NAV_LINKS = [
  { to: '/', label: 'Beranda' },
  { to: '/pokedex', label: 'Jelajahi' },
  { to: '/favorites', label: 'Favorites' },
]

const linkClass = 'text-gray-400 transition hover:text-white'

export default function Footer() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative mt-12 overflow-hidden bg-gray-900 text-gray-300">
      {/* Garis aksen di tepi atas */}
      <div className="h-1 bg-linear-to-r from-red-500 via-yellow-400 to-blue-500" />

      {/* Watermark Pokéball (dekoratif) */}
      <Pokeball
        tone="light"
        className="pointer-events-none absolute -bottom-16 -right-16 h-72 w-72 opacity-[0.06]"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 text-xl font-bold text-white">
              <Pokeball tone="color" className="h-8 w-8" />
              Pokédex
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-400">
              Jelajahi 1025 Pokémon lengkap dengan type, abilities, dan base stats. Simpan Pokémon
              favoritmu dan temukan lewat pencarian atau filter type.
            </p>
          </div>

          {/* Navigasi */}
          <nav aria-label="Footer">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Menu</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {NAV_LINKS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Pintasan type */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Jelajahi type
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {QUICK_TYPES.map((type) => (
                <li key={type}>
                  <Link to={`/pokedex?type=${type}`} className={linkClass}>
                    {getTypeLabel(type)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Baris bawah: disclaimer + kembali ke atas */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-3xl text-xs leading-relaxed text-gray-500">
            Data dan gambar dari{' '}
            <a
              href="https://pokeapi.co"
              target="_blank"
              rel="noreferrer"
              className="underline transition hover:text-gray-300"
            >
              PokéAPI
            </a>
            . Pokémon dan nama karakternya adalah merek dagang Nintendo, Game Freak, dan Creatures
            Inc. Proyek ini tidak berafiliasi dengan mereka.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-gray-300 transition hover:border-white/40 hover:bg-white/10 hover:text-white sm:self-auto"
          >
            Kembali ke atas
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  )
}
