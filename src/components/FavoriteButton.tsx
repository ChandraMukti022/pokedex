import { useFavoritesStore } from '../store/favoritesStore'

interface FavoriteButtonProps {
  pokemonId: number
  pokemonName: string
  className?: string
}

export default function FavoriteButton({
  pokemonId,
  pokemonName,
  className = '',
}: FavoriteButtonProps) {
  const isFavorite = useFavoritesStore((state) => state.ids.includes(pokemonId))
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(pokemonId)}
      aria-pressed={isFavorite}
      aria-label={
        isFavorite
          ? `Hapus ${pokemonName} dari favorit`
          : `Tambahkan ${pokemonName} ke favorit`
      }
      className={`flex items-center justify-center rounded-full bg-white/90 text-xl shadow transition hover:scale-110 ${
        isFavorite ? 'text-red-500' : 'text-gray-400'
      } ${className}`}
    >
      {isFavorite ? '♥' : '♡'}
    </button>
  )
}