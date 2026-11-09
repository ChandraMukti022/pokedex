import { Routes, Route, Link } from 'react-router-dom'

   import HomePage from './pages/HomePage'
   import PokemonDetailPage from './pages/PokemonDetailPage'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="flex gap-4 bg-white p-4 shadow">
        <Link to="/" className="font-semibold">Pokédex</Link>
        <Link to="/favorites">Favorites</Link>
      </nav>

      <main className="mx-auto max-w-6xl p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
          <Route path="/favorites" element={<p>Favorites</p>} />
          <Route path="*" element={<p>404 Not Found</p>} />
        </Routes>
      </main>
    </div>
  )
}