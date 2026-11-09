import { useQuery } from '@tanstack/react-query'
import { fetchTypes } from '../api/pokeapi'

export function useTypes() {
  return useQuery({
    queryKey: ['types'],
    queryFn: fetchTypes,
    staleTime: Infinity,
  })
}