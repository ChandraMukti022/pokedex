import { useQuery } from '@tanstack/react-query'
import { fetchPokemonDetail } from '../api/pokeapi'

export function usePokemonDetail(id: number | null) {
  return useQuery({
    queryKey: ['pokemon-detail', id],
    queryFn: () => fetchPokemonDetail(id as number),
    enabled: id !== null, // jangan request kalau ID tidak valid
    staleTime: Infinity,
  })
}
