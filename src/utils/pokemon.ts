import type { NamedResource, PokemonSummary } from '../types/pokemon'

// Pokémon dengan ID di atas ini adalah form khusus (mega, gmax, dll.)
export const MAX_POKEMON_ID = 1025

// "https://pokeapi.co/api/v2/pokemon/25/" -> 25
export function extractId(url: string): number {
  const parts = url.split('/').filter(Boolean)
  return Number(parts[parts.length - 1])
}

// ID -> URL gambar official artwork (tidak perlu request detail)
export function buildImageUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

// NamedResource -> PokemonSummary (menambahkan ID dari URL)
export function toSummary(item: NamedResource): PokemonSummary {
  return { id: extractId(item.url), name: item.name }
}

// "mr-mime" -> "Mr Mime"
export function formatName(name: string): string {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// 25 -> "#025"
export function formatId(id: number): string {
  return `#${String(id).padStart(3, '0')}`
}