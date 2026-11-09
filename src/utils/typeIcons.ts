// ID type di PokéAPI (dipakai untuk membangun URL ikon resmi)
const TYPE_IDS: Record<string, number> = {
  normal: 1,
  fighting: 2,
  flying: 3,
  poison: 4,
  ground: 5,
  rock: 6,
  bug: 7,
  ghost: 8,
  steel: 9,
  fire: 10,
  water: 11,
  grass: 12,
  electric: 13,
  psychic: 14,
  ice: 15,
  dragon: 16,
  dark: 17,
  fairy: 18,
}

// "fire" -> URL label type resmi (ikon + nama). Type tak dikenal -> undefined.
export function getTypeIconUrl(type: string): string | undefined {
  const id = TYPE_IDS[type]
  if (!id) return undefined
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/${id}.png`
}
