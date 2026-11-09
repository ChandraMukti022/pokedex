import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usePokemonIndex } from '../hooks/usePokemonIndex'
import { usePokemonIdsByType } from '../hooks/usePokemonIdsByType'
import { useTypes } from '../hooks/useTypes'
import PokemonCard from '../components/PokemonCard'
import Pagination from '../components/Pagination'
import PageLoader from '../components/PageLoader'
import ErrorState from '../components/ErrorState'
import SearchBar from '../components/SearchBar'
import TypeFilter from '../components/TypeFilter'
import TypeBadge from '../components/TypeBadge'
import Pokeball from '../components/Pokeball'
import { getCardStyle } from '../utils/typeStyles'
import { getTypeLabel } from '../utils/typeLabels'

const PAGE_SIZE = 20
const SEARCH_DELAY = 300

export default function PokedexPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // State dari URL (sumber kebenaran untuk search, type, dan page)
  const q = searchParams.get('q') ?? ''
  const type = searchParams.get('type') ?? ''
  const requestedPage = Number(searchParams.get('page')) || 1

  // State lokal: isi kotak search (supaya mengetik terasa langsung)
  const [input, setInput] = useState(q)
  const [prevQ, setPrevQ] = useState(q)

  // Sinkronkan kotak search kalau q di URL berubah dari luar (tombol Back, klik navbar).
  // Teks yang sedang diketik tidak ditimpa, karena sudah sama dengan q setelah debounce.
  if (q !== prevQ) {
    setPrevQ(q)
    if (q !== input.trim()) setInput(q)
  }
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

  // Tombol Cari / Enter: terapkan kata kunci sekarang juga, tanpa menunggu debounce
  function handleSearchSubmit() {
    clearTimeout(timeoutRef.current)
    updateParams({ q: input.trim(), page: '' }, true)
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
    content = <PageLoader label="Memuat Pokémon..." />
  } else if (indexQuery.isError) {
    content = <ErrorState message={indexQuery.error.message} onRetry={() => indexQuery.refetch()} />
  } else if (typeIdsQuery.isError) {
    content = (
      <ErrorState message={typeIdsQuery.error.message} onRetry={() => typeIdsQuery.refetch()} />
    )
  } else if (filtered.length === 0) {
    const detail = q
      ? `Tidak ada Pokémon dengan nama "${q}"${type ? ` pada type ${getTypeLabel(type)}` : ''}.`
      : `Belum ada Pokémon dengan type ${getTypeLabel(type)}.`

    content = (
      <div className="flex flex-col items-center rounded-3xl bg-white px-6 py-12 text-center shadow-sm ring-1 ring-black/5">
        <Pokeball tone="gray" className="h-20 w-20" />
        <h2 className="mt-5 text-xl font-bold">Pokémon tidak ditemukan</h2>
        <p className="mt-1 max-w-md text-gray-500">
          {detail} Periksa ejaan atau coba kata kunci lain.
        </p>
        {hasActiveFilter && (
          <button
            type="button"
            onClick={handleReset}
            className="mt-6 rounded-full bg-gray-900 px-6 py-2.5 font-semibold text-white transition hover:bg-gray-700"
          >
            Hapus semua filter
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
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm text-gray-500">{filtered.length} Pokémon ditemukan</p>
          {hasActiveFilter && (
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full bg-white px-4 py-1.5 text-sm font-medium shadow-sm ring-1 ring-black/5 transition hover:bg-gray-100"
            >
              Hapus filter
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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
      {/* ===== Header berwarna (mengikuti type yang dipilih) + filter chip ===== */}
      <div
        className={`relative overflow-hidden rounded-3xl bg-linear-to-br p-6 shadow ring-1 ring-black/5 transition-colors duration-300 sm:p-8 ${
          type ? getCardStyle(type).art : 'from-sky-300 to-indigo-200'
        }`}
      >
        <Pokeball
          tone="light"
          className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 sm:h-64 sm:w-64"
        />

        <div className="relative">
          <h1 className="flex flex-wrap items-center gap-3 text-3xl font-extrabold sm:text-4xl">
            {type ? (
              <>
                <span>Elemen {getTypeLabel(type)}</span>
                <TypeBadge type={type} className="h-8" />
              </>
            ) : (
              'Semua Pokémon'
            )}
          </h1>
          <p className="mt-1 text-gray-600">
            Pilih satu type untuk menyaring, klik lagi untuk membatalkan.
          </p>

          <div className="mt-4">
            <TypeFilter
              types={typesQuery.data ?? []}
              value={type}
              onChange={handleTypeChange}
              disabled={typesQuery.isPending}
            />
          </div>
        </div>
      </div>

      {/* ===== Bar search: menempel di bawah navbar (top-16 = tinggi navbar) ===== */}
      <div className="sticky top-16 z-10 -mx-4 mb-2 mt-4 bg-gray-50/80 px-4 py-3 backdrop-blur-md">
        <SearchBar value={input} onChange={handleSearchChange} onSubmit={handleSearchSubmit} />
      </div>

      {content}
    </section>
  )
}
