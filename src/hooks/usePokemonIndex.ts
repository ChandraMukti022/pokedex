import { useQuery } from '@tanstack/react-query'
import { fetchPokemonIndex } from '../api/pokeapi'

export function usePokemonIndex() {
  return useQuery({
    queryKey: ['pokemon-index'],
    queryFn: fetchPokemonIndex,
    staleTime: Infinity, // daftar nama tidak berubah selama sesi
  })
}
