import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { usePokemonDetail } from '../hooks/usePokemonDetail'
import TypeBadge from '../components/TypeBadge'
import StatBar from '../components/StatBar'
import FavoriteButton from '../components/FavoriteButton'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import PageLoader from '../components/PageLoader'
import { getCardStyle } from '../utils/typeStyles'
import {
  MAX_POKEMON_ID,
  buildImageUrl,
  formatHeight,
  formatId,
  formatName,
  formatStatName,
  formatWeight,
} from '../utils/pokemon'

const ATTACK_STATS = ['attack', 'special-attack']

export default function PokemonDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  // Hanya angka bulat 1..MAX_POKEMON_ID yang dianggap valid
  const numericId = Number(id)
  const isValidId = Number.isInteger(numericId) && numericId >= 1 && numericId <= MAX_POKEMON_ID

  const { data, isPending, isError, error, refetch } = usePokemonDetail(
    isValidId ? numericId : null,
  )

  // Kembali ke halaman sebelumnya (filter/search tetap), atau ke Home kalau dibuka langsung
  function handleBack() {
    if (location.key !== 'default') navigate(-1)
    else navigate('/')
  }

  const backButton = (
    <button
      type="button"
      onClick={handleBack}
      className="mb-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium shadow transition hover:bg-gray-100"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
      Kembali
    </button>
  )

  if (!isValidId) {
    return (
      <div>
        {backButton}
        <EmptyState
          title="Pokémon tidak ditemukan"
          description={`ID Pokémon harus berupa angka antara 1 dan ${MAX_POKEMON_ID}.`}
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
        <PageLoader label="Memuat detail Pokémon..." />
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

  const name = formatName(data.name)
  const mainType = data.types[0]?.type.name
  const style = getCardStyle(mainType)
  const hp = data.stats.find((item) => item.stat.name === 'hp')?.base_stat
  const mainAbility = data.abilities.find((item) => !item.is_hidden)?.ability.name
  const attacks = data.stats.filter((item) => ATTACK_STATS.includes(item.stat.name))
  const totalStats = data.stats.reduce((sum, item) => sum + item.base_stat, 0)
  const imageUrl = data.sprites.other?.['official-artwork']?.front_default ?? buildImageUrl(data.id)

  return (
    <div>
      {backButton}

      <div className="grid gap-6 lg:grid-cols-[24rem_1fr] lg:items-start">
        {/* ===== Kiri: kartu ===== */}
        <article
          className={`mx-auto w-full max-w-sm rounded-2xl bg-linear-to-br p-3 shadow-xl lg:sticky lg:top-24 ${style.frame}`}
        >
          <div className={`rounded-xl p-4 ${style.body}`}>
            <header className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase text-gray-500">Basic</p>
                <h1 className="truncate text-2xl font-bold leading-tight">{name}</h1>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 font-bold">
                {hp !== undefined && (
                  <span className="text-lg">
                    <span className="text-[10px]">HP</span> {hp}
                  </span>
                )}
                <FavoriteButton
                  pokemonId={data.id}
                  pokemonName={name}
                  className="h-9 w-9 text-xl"
                />
              </div>
            </header>

            <div
              className={`mt-2 rounded-lg border-4 border-amber-300 bg-linear-to-br p-3 shadow-inner ${style.art}`}
            >
              <img
                src={imageUrl}
                alt={name}
                className="mx-auto aspect-square w-full object-contain drop-shadow-lg"
              />
            </div>

            <p className="mt-2 rounded bg-white/70 py-1 text-center text-xs font-medium italic text-gray-600">
              HT: {formatHeight(data.height)} &nbsp; WT: {formatWeight(data.weight)}
            </p>

            <div className="mt-3 space-y-1.5 text-sm">
              {mainAbility && (
                <p className="font-semibold text-gray-700">
                  <span className="mr-1.5 rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                    Ability
                  </span>
                  {formatName(mainAbility)}
                </p>
              )}
              {attacks.map((item) => (
                <div
                  key={item.stat.name}
                  className="flex items-center justify-between border-t border-black/10 pt-1.5"
                >
                  <span className="font-semibold">{formatStatName(item.stat.name)}</span>
                  <span className="font-bold">{item.base_stat}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span>{mainType ? formatName(mainType) : ''}</span>
              <span>{formatId(data.id)}</span>
            </div>
          </div>
        </article>

        {/* ===== Kanan: panel detail ===== */}
        <div className="space-y-4">
          <section className="overflow-hidden rounded-2xl bg-white shadow">
            <div className={`h-2 bg-linear-to-r ${style.frame}`} />
            <div className="p-5">
              <h2 className="mb-4 text-xl font-bold">Informasi {name}</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-3">
                  <dt className="text-sm text-gray-500">Height</dt>
                  <dd className="text-lg font-semibold">{formatHeight(data.height)}</dd>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <dt className="text-sm text-gray-500">Weight</dt>
                  <dd className="text-lg font-semibold">{formatWeight(data.weight)}</dd>
                </div>
                <div className="col-span-2 rounded-lg bg-gray-50 p-3">
                  <dt className="mb-2 text-sm text-gray-500">Abilities</dt>
                  <dd>
                    <ul className="flex flex-wrap gap-2">
                      {data.abilities.map((item) => (
                        <li
                          key={item.ability.name}
                          className="rounded-lg bg-white px-3 py-1 text-sm font-medium shadow-sm"
                        >
                          {formatName(item.ability.name)}
                          {item.is_hidden && (
                            <span className="font-normal text-gray-500"> (hidden)</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow">
            <h2 className="mb-3 text-xl font-bold">Type</h2>
            <div className="flex flex-wrap gap-2">
              {data.types.map((item) => (
                <TypeBadge key={item.type.name} type={item.type.name} />
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-xl font-bold">Base Stats</h2>
              <p className="text-sm text-gray-500">
                Total: <span className="font-bold text-gray-900">{totalStats}</span>
              </p>
            </div>
            <div className="space-y-2.5">
              {data.stats.map((item) => (
                <StatBar key={item.stat.name} name={item.stat.name} value={item.base_stat} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
