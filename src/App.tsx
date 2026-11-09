import { Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PokemonDetailPage from './pages/PokemonDetailPage'
import FavoritesPage from './pages/FavoritesPage'
import { useFavoritesStore } from './store/favoritesStore'

export default function App() {
  const favoriteCount = useFavoritesStore((state) => state.ids.length)

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="flex gap-4 bg-white p-4 shadow">
        <Link to="/" className="font-semibold">Pokédex</Link>
        <Link to="/favorites">
          Favorites
          {favoriteCount > 0 && (
            <span className="ml-1 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
              {favoriteCount}
            </span>
          )}
        </Link>
      </nav>

      <main className="mx-auto max-w-6xl p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="*" element={<p>404 Not Found</p>} />
        </Routes>
      </main>
    </div>
  )
}