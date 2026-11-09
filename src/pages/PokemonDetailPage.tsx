import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { usePokemonDetail } from '../hooks/usePokemonDetail'
import TypeBadge from '../components/TypeBadge'
import StatBar from '../components/StatBar'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import {
  MAX_POKEMON_ID,
  buildImageUrl,
  formatHeight,
  formatId,
  formatName,
  formatWeight,
} from '../utils/pokemon'

export default function PokemonDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  // Hanya angka bulat 1..MAX_POKEMON_ID yang dianggap valid
  const numericId = Number(id)
  const isValidId =
    Number.isInteger(numericId) && numericId >= 1 && numericId <= MAX_POKEMON_ID

  const { data, isPending, isError, error, refetch } = usePokemonDetail(
    isValidId ? numericId : null,
  )

  // Kembali ke halaman sebelumnya (filter/search tetap), atau ke Home kalau dibuka langsung
  function handleBack() {
    if (location.key !== 'default') navigate(-1)
    else navigate('/')
  }

  const backButton = (
    <button onClick={handleBack} className="mb-4 text-blue-600 hover:underline">
      ← Kembali
    </button>
  )

  if (!isValidId) {
    return (
      <div>
        {backButton}
        <EmptyState
          title="Pokémon tidak ditemukan"
          description="ID Pokémon harus berupa angka antara 1 dan 1025."
        />
        <div className="mt-4 text-center">
          <Link to="/" className="text-blue-600 hover:underline">
            Ke halaman utama
          </Link>
        </div>
      </div>
    )
  }

  if (isPending) {
    return (
      <div>
        {backButton}
        <div className="h-96 animate-pulse rounded-xl bg-gray-200" />
      </div>
    )
  }

  if (isError) {
    return (
      <div>
        {backButton}
        <ErrorState message={error.message} onRetry={() => refetch()} />
      </div>
    )
  }

  const imageUrl =
    data.sprites.other?.['official-artwork']?.front_default ?? buildImageUrl(data.id)

  return (
    <div>
      {backButton}

      <article className="rounded-xl bg-white p-6 shadow">
        <div className="flex flex-col gap-6 md:flex-row">
          <img
            src={imageUrl}
            alt={formatName(data.name)}
            className="mx-auto aspect-square w-full max-w-xs object-contain"
          />

          <div className="flex-1 space-y-5">
            <header>
              <p className="text-gray-500">{formatId(data.id)}</p>
              <h1 className="text-3xl font-bold">{formatName(data.name)}</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.types.map((item) => (
                  <TypeBadge key={item.type.name} type={item.type.name} />
                ))}
              </div>
            </header>

            <dl className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-gray-50 p-3">
                <dt className="text-sm text-gray-500">Height</dt>
                <dd className="font-semibold">{formatHeight(data.height)}</dd>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <dt className="text-sm text-gray-500">Weight</dt>
                <dd className="font-semibold">{formatWeight(data.weight)}</dd>
              </div>
            </dl>

            <section>
              <h2 className="mb-2 font-semibold">Abilities</h2>
              <ul className="flex flex-wrap gap-2">
                {data.abilities.map((item) => (
                  <li
                    key={item.ability.name}
                    className="rounded-lg bg-gray-100 px-3 py-1 text-sm"
                  >
                    {formatName(item.ability.name)}
                    {item.is_hidden && <span className="text-gray-500"> (hidden)</span>}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-2 font-semibold">Base Stats</h2>
              <div className="space-y-2">
                {data.stats.map((item) => (
                  <StatBar key={item.stat.name} name={item.stat.name} value={item.base_stat} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </article>
    </div>
  )
}