import { formatName } from './pokemon'

const TYPE_LABELS_ID: Record<string, string> = {
  normal: 'Normal',
  fire: 'Api',
  water: 'Air',
  electric: 'Listrik',
  grass: 'Rumput',
  ice: 'Es',
  fighting: 'Bertarung',
  poison: 'Racun',
  ground: 'Tanah',
  flying: 'Terbang',
  psychic: 'Psikis',
  bug: 'Serangga',
  rock: 'Batu',
  ghost: 'Hantu',
  dragon: 'Naga',
  dark: 'Gelap',
  steel: 'Baja',
  fairy: 'Peri',
}

// "grass" -> "Rumput". Kalau tidak ada terjemahan, pakai nama aslinya.
export function getTypeLabel(type: string): string {
  return TYPE_LABELS_ID[type] ?? formatName(type)
}
