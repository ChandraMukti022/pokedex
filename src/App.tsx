import { lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

// Setiap halaman dimuat hanya saat dibutuhkan (code splitting)
const HomePage = lazy(() => import('./pages/HomePage'))
const PokedexPage = lazy(() => import('./pages/PokedexPage'))
const PokemonDetailPage = lazy(() => import('./pages/PokemonDetailPage'))
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="pokedex" element={<PokedexPage />} />
        <Route path="pokemon/:id" element={<PokemonDetailPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
