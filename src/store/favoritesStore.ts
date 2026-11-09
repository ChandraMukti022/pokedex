import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesState {
  ids: number[]
  toggleFavorite: (id: number) => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      ids: [],
      toggleFavorite: (id) =>
        set((state) => ({
          ids: state.ids.includes(id)
            ? state.ids.filter((favoriteId) => favoriteId !== id)
            : [...state.ids, id],
        })),
    }),
    {
      name: 'pokedex-favorites', // nama key di localStorage
      partialize: (state) => ({ ids: state.ids }), // yang disimpan hanya ids
    },
  ),
)