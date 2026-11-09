import { Link, NavLink } from 'react-router-dom'
import { useFavoritesStore } from '../store/favoritesStore'

// NavLink memberi tahu kita apakah linknya sedang aktif (isActive)
function navLinkClass({ isActive }: { isActive: boolean }) {
  return `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
  }`
}

export default function Navbar() {
  const favoriteCount = useFavoritesStore((state) => state.ids.length)

  return (
    <header className="sticky top-0 z-10 bg-white shadow">
      <nav className="mx-auto flex max-w-6xl items-center gap-2 p-3">
        <Link to="/" className="mr-2 text-lg font-bold">
          Pokédex
        </Link>

        <NavLink to="/" end className={navLinkClass}>
          Beranda
        </NavLink>

        <NavLink to="/favorites" className={navLinkClass}>
          Favorites
          {favoriteCount > 0 && (
            <span className="ml-1 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
              {favoriteCount}
            </span>
          )}
        </NavLink>
      </nav>
    </header>
  )
}