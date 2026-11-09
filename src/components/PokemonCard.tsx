import { Link } from 'react-router-dom'
import type { PokemonSummary } from '../types/pokemon'
import { usePokemonDetail } from '../hooks/usePokemonDetail'
import { getCardStyle } from '../utils/typeStyles'
import {
  buildImageUrl,
  formatHeight,
  formatId,
  formatName,
  formatStatName,
  formatWeight,
} from '../utils/pokemon'
import FavoriteButton from './FavoriteButton'
import TypeBadge from './TypeBadge'

const ATTACK_STATS = ['attack', 'special-attack']

interface PokemonCardProps {
  pokemon: PokemonSummary
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const name = formatName(pokemon.name)

  // Data detail untuk isi kartu (cache dipakai bersama halaman detail)
  const { data } = usePokemonDetail(pokemon.id)

  const mainType = data?.types[0]?.type.name
  const style = getCardStyle(mainType)
  const hp = data?.stats.find((item) => item.stat.name === 'hp')?.base_stat
  const ability = data?.abilities.find((item) => !item.is_hidden)?.ability.name
  const attacks = data?.stats.filter((item) => ATTACK_STATS.includes(item.stat.name)) ?? []

  return (
    <div className="group relative">
      <Link
        to={`/pokemon/${pokemon.id}`}
        className={`flex aspect-[5/7] rounded-xl bg-linear-to-br p-[3.5%] shadow-md transition duration-200 group-hover:-translate-y-1 group-hover:shadow-xl ${style.frame}`}
      >
        <div className={`flex min-w-0 flex-1 flex-col rounded-lg p-2 ${style.body}`}>
          {/* Header: nama, HP, ikon type */}
          <div className="flex shrink-0 items-center justify-between gap-1">
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase leading-none text-gray-500">Basic</p>
              <h2 className="truncate text-sm font-bold leading-tight">{name}</h2>
            </div>
            <div className="flex shrink-0 items-center gap-1 text-sm font-bold">
              {hp !== undefined && (
                <span>
                  <span className="text-[9px]">HP</span> {hp}
                </span>
              )}
            </div>
          </div>

          {/* Bingkai gambar: mengisi sisa ruang (fleksibel) */}
          <div
            className={`relative mt-1.5 min-h-24 flex-1 overflow-hidden rounded-md border-2 border-amber-300 bg-linear-to-br shadow-inner ${style.art}`}
          >
            <img
              src={buildImageUrl(pokemon.id)}
              alt={name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-contain p-1 transition duration-200 group-hover:scale-105"
            />
          </div>

          {/* Strip info: tinggi dan berat */}
          <p className="mt-1 shrink-0 rounded-sm bg-white/70 px-1 py-0.5 text-center text-[9px] font-medium italic text-gray-600">
            {data
              ? `HT: ${formatHeight(data.height)}  WT: ${formatWeight(data.weight)}`
              : 'Memuat...'}
          </p>

          {/* Isi: ability dan serangan */}
          <div className="mt-1.5 shrink-0 space-y-1 text-[11px]">
            {data ? (
              <>
                {ability && (
                  <p className="truncate font-semibold text-gray-700">
                    <span className="mr-1 rounded bg-red-500 px-1 text-[9px] font-bold uppercase text-white">
                      Ability
                    </span>
                    {formatName(ability)}
                  </p>
                )}
                {attacks.map((item) => (
                  <div
                    key={item.stat.name}
                    className="flex items-center justify-between border-t border-black/10 pt-1"
                  >
                    <span className="font-semibold">{formatStatName(item.stat.name)}</span>
                    <span className="font-bold">{item.base_stat}</span>
                  </div>
                ))}
              </>
            ) : (
              <div className="animate-pulse space-y-1.5">
                <div className="h-3 w-2/3 rounded bg-black/10" />
                <div className="h-3 rounded bg-black/10" />
                <div className="h-3 rounded bg-black/10" />
              </div>
            )}
          </div>

          {/* Footer: type dan nomor (disisakan ruang untuk tombol hati) */}
          <div className="mt-1 flex shrink-0 items-center justify-between pr-9 pt-1 text-[10px] text-gray-500">
            <span>{mainType && <TypeBadge type={mainType} className="h-4" />}</span>
            <span>{formatId(pokemon.id)}</span>
          </div>
        </div>
      </Link>

      <FavoriteButton
        pokemonId={pokemon.id}
        pokemonName={name}
        className="absolute bottom-3 right-3 h-8 w-8"
      />
    </div>
  )
}
