import { useSearchParams } from 'react-router-dom'
import { usePokemonIndex } from '../hooks/usePokemonIndex'
import PokemonCard from '../components/PokemonCard'
import Pagination from '../components/Pagination'
import LoadingGrid from '../components/LoadingGrid'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'

const PAGE_SIZE = 20

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data, isPending, isError, error, refetch } = usePokemonIndex()

  if (isPending) return <LoadingGrid />

  if (isError) {
    return <ErrorState message={error.message} onRetry={() => refetch()} />
  }

  if (data.length === 0) {
    return <EmptyState title="Tidak ada Pokémon" />
  }

  const totalPages = Math.ceil(data.length / PAGE_SIZE)
  const requestedPage = Number(searchParams.get('page')) || 1
  const page = Math.min(Math.max(requestedPage, 1), totalPages)

  const start = (page - 1) * PAGE_SIZE
  const pagePokemon = data.slice(start, start + PAGE_SIZE)

  function handlePageChange(newPage: number) {
    setSearchParams((prev) => {
      prev.set('page', String(newPage))
      return prev
    })
    window.scrollTo({ top: 0 })
  }

  return (
    <section>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {pagePokemon.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </section>
  )
}