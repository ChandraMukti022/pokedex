import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usePokemonIndex } from '../hooks/usePokemonIndex'
import { usePokemonIdsByType } from '../hooks/usePokemonIdsByType'
import { useTypes } from '../hooks/useTypes'
import PokemonCard from '../components/PokemonCard'
import Pagination from '../components/Pagination'
import LoadingGrid from '../components/LoadingGrid'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import SearchBar from '../components/SearchBar'
import TypeFilter from '../components/TypeFilter'

const PAGE_SIZE = 20
const SEARCH_DELAY = 300

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // State dari URL (sumber kebenaran untuk search, type, dan page)
  const q = searchParams.get('q') ?? ''
  const type = searchParams.get('type') ?? ''
  const requestedPage = Number(searchParams.get('page')) || 1

  // State lokal: isi kotak search (supaya mengetik terasa langsung)
  const [input, setInput] = useState(q)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Data dari API
  const indexQuery = usePokemonIndex()
  const typesQuery = useTypes()
  const typeIdsQuery = usePokemonIdsByType(type)

  // Bersihkan timer kalau halaman ditutup
  useEffect(() => {
    return () => clearTimeout(timeoutRef.current)
  }, [])

  // Ubah beberapa parameter URL sekaligus. Nilai kosong = hapus parameter.
  function updateParams(changes: Record<string, string>, replace = false) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        Object.entries(changes).forEach(([key, value]) => {
          if (value) next.set(key, value)
          else next.delete(key)
        })
        return next
      },
      { replace },
    )
  }

  function handleSearchChange(value: string) {
    setInput(value)
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      updateParams({ q: value.trim(), page: '' }, true)
    }, SEARCH_DELAY)
  }

  function handleTypeChange(value: string) {
    updateParams({ type: value, page: '' })
  }

  function handleReset() {
    clearTimeout(timeoutRef.current)
    setInput('')
    updateParams({ q: '', type: '', page: '' })
  }

  function handlePageChange(newPage: number) {
    updateParams({ page: String(newPage) })
    window.scrollTo({ top: 0 })
  }

  // Gabungkan search dan type
  const filtered = useMemo(() => {
    if (!indexQuery.data) return []

    const keyword = q.toLowerCase().replace(/\s+/g, '-')
    const typeIds = typeIdsQuery.data ? new Set(typeIdsQuery.data) : null

    return indexQuery.data.filter((pokemon) => {
      const matchName = !keyword || pokemon.name.includes(keyword)
      const matchType = type === '' || (typeIds !== null && typeIds.has(pokemon.id))
      return matchName && matchType
    })
  }, [indexQuery.data, typeIdsQuery.data, q, type])

  const hasActiveFilter = q !== '' || type !== ''

  // Tentukan isi area hasil
  let content
  if (indexQuery.isPending || typeIdsQuery.isLoading) {
    content = <LoadingGrid />
  } else if (indexQuery.isError) {
    content = <ErrorState message={indexQuery.error.message} onRetry={() => indexQuery.refetch()} />
  } else if (typeIdsQuery.isError) {
    content = <ErrorState message={typeIdsQuery.error.message} onRetry={() => typeIdsQuery.refetch()} />
  } else if (filtered.length === 0) {
    content = (
      <div className="space-y-4 text-center">
        <EmptyState
          title="Pokémon tidak ditemukan"
          description="Coba kata kunci lain atau ganti filter type."
        />
        {hasActiveFilter && (
          <button
            onClick={handleReset}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Reset pencarian
          </button>
        )}
      </div>
    )
  } else {
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
    const page = Math.min(Math.max(requestedPage, 1), totalPages)
    const start = (page - 1) * PAGE_SIZE
    const pagePokemon = filtered.slice(start, start + PAGE_SIZE)

    content = (
      <>
        <p className="mb-3 text-sm text-gray-500">{filtered.length} Pokémon ditemukan</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {pagePokemon.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </>
    )
  }

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <SearchBar value={input} onChange={handleSearchChange} />
        <TypeFilter
          types={typesQuery.data ?? []}
          value={type}
          onChange={handleTypeChange}
          disabled={typesQuery.isPending}
        />
        {hasActiveFilter && (
          <button
            onClick={handleReset}
            className="rounded-lg bg-white px-4 py-2 shadow hover:bg-gray-100"
          >
            Reset
          </button>
        )}
      </div>

      {content}
    </section>
  )
}