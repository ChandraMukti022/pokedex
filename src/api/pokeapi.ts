import type {
  PokemonDetail,
  PokemonListResponse,
  PokemonSummary,
  TypeDetailResponse,
  TypeListResponse,
} from '../types/pokemon'
import { MAX_POKEMON_ID, extractId, toSummary } from '../utils/pokemon'

const BASE_URL = 'https://pokeapi.co/api/v2'

// Fungsi dasar: semua request lewat sini supaya error ditangani di satu tempat
async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`)

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Data tidak ditemukan')
    }
    throw new Error(`Request gagal (status ${response.status})`)
  }

  return response.json() as Promise<T>
}

// Semua Pokémon (hanya ID + nama), dibatasi sampai MAX_POKEMON_ID
export async function fetchPokemonIndex(): Promise<PokemonSummary[]> {
  const data = await fetchJson<PokemonListResponse>(
    `/pokemon?limit=${MAX_POKEMON_ID}&offset=0`,
  )
  return data.results.map(toSummary)
}

// Type yang tidak punya Pokémon biasa, tidak ditampilkan di filter
const EXCLUDED_TYPES = ['unknown', 'shadow', 'stellar']

// Daftar nama type untuk dropdown filter
export async function fetchTypes(): Promise<string[]> {
  const data = await fetchJson<TypeListResponse>('/type')
  return data.results
    .map((item) => item.name)
    .filter((name) => !EXCLUDED_TYPES.includes(name))
}



// ID Pokémon yang punya type tertentu, form khusus dibuang
export async function fetchPokemonIdsByType(type: string): Promise<number[]> {
  const data = await fetchJson<TypeDetailResponse>(`/type/${type}`)
  return data.pokemon
    .map((entry) => extractId(entry.pokemon.url))
    .filter((id) => id <= MAX_POKEMON_ID)
}

// Detail satu Pokémon berdasarkan ID atau nama
export async function fetchPokemonDetail(
  idOrName: string | number,
): Promise<PokemonDetail> {
  return fetchJson<PokemonDetail>(`/pokemon/${idOrName}`)
}