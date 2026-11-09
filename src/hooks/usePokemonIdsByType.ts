import { useQuery } from '@tanstack/react-query'
import { fetchPokemonIdsByType } from '../api/pokeapi'

export function usePokemonIdsByType(type: string) {
  return useQuery({
    queryKey: ['type-ids', type],
    queryFn: () => fetchPokemonIdsByType(type),
    enabled: type !== '', // hanya jalan kalau ada type yang dipilih
    staleTime: Infinity,
  })
}
