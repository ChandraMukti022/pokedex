import { Link } from 'react-router-dom'
import { useFavoritesStore } from '../store/favoritesStore'
import { usePokemonIndex } from '../hooks/usePokemonIndex'
import PokemonCard from '../components/PokemonCard'
import LoadingGrid from '../components/LoadingGrid'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'

export default function FavoritesPage() {
  const ids = useFavoritesStore((state) => state.ids)
  const { data, isPending, isError, error, refetch } = usePokemonIndex()

  if (ids.length === 0) {
    return (
      <div className="space-y-4 text-center">
        <EmptyState
          title="Belum ada favorit"
          description="Tekan ikon hati pada Pokémon untuk menambahkannya ke sini."
        />
        <Link
          to="/"
          className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Jelajahi Pokémon
        </Link>
      </div>
    )
  }

  if (isPending) return <LoadingGrid count={Math.min(ids.length, 20)} />

  if (isError) {
    return <ErrorState message={error.message} onRetry={() => refetch()} />
  }

  // Ambil data lengkap dari cache berdasarkan ID favorit
  const favoriteIds = new Set(ids)
  const favorites = data.filter((pokemon) => favoriteIds.has(pokemon.id))

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Favorites ({favorites.length})</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {favorites.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    </section>
  )
}