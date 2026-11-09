import { Link, NavLink } from 'react-router-dom'
import { useFavoritesStore } from '../store/favoritesStore'
import Pokeball from './Pokeball'

// NavLink memberi tahu kita apakah linknya sedang aktif (isActive)
function navLinkClass({ isActive }: { isActive: boolean }) {
  return `rounded-full px-3 py-1.5 text-sm font-medium transition sm:px-4 ${
    isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-black/5'
  }`
}

export default function Navbar() {
  const favoriteCount = useFavoritesStore((state) => state.ids.length)

  return (
    // Tinggi tetap 4rem: dipakai HomeHero untuk menaruh hero tepat di bawah navbar.
    // Latar semi-transparan + blur, jadi warna hero ikut terlihat di belakangnya.
    <header className="sticky top-0 z-20 h-16 border-b border-black/5 bg-white/70 backdrop-blur-md">
      <nav className="mx-auto flex h-full max-w-6xl items-center px-4">
        <Link
          to="/"
          aria-label="Pokédex, ke beranda"
          className="flex items-center gap-2 text-lg font-bold"
        >
          <Pokeball tone="color" className="h-8 w-8" />
          <span className="hidden sm:inline">Pokédex</span>
        </Link>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <NavLink to="/" end className={navLinkClass}>
            Beranda
          </NavLink>

          <NavLink to="/pokedex" className={navLinkClass}>
            Jelajahi
          </NavLink>

          <NavLink to="/favorites" className={navLinkClass}>
            Favorites
            {favoriteCount > 0 && (
              <span className="ml-1.5 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                {favoriteCount}
              </span>
            )}
          </NavLink>
        </div>
      </nav>
    </header>
  )
}
