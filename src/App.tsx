import { Routes, Route, Link } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="flex gap-4 bg-white p-4 shadow">
        <Link to="/" className="font-semibold">Pokédex</Link>
        <Link to="/favorites">Favorites</Link>
      </nav>

      <main className="mx-auto max-w-6xl p-4">
        <Routes>
          <Route path="/" element={<p>Home (listing)</p>} />
          <Route path="/pokemon/:id" element={<p>Detail</p>} />
          <Route path="/favorites" element={<p>Favorites</p>} />
          <Route path="*" element={<p>404 Not Found</p>} />
        </Routes>
      </main>
    </div>
  )
}