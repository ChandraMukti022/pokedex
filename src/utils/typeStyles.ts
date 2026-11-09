// Gaya warna kartu per type (listing, detail, featured di beranda)
interface CardStyle {
  frame: string // gradasi bingkai luar
  art: string // gradasi latar gambar
  body: string // warna isi kartu
}

const CARD_STYLES: Record<string, CardStyle> = {
  normal: {
    frame: 'from-gray-300 to-gray-400',
    art: 'from-stone-300 to-stone-100',
    body: 'bg-gray-50',
  },
  fire: {
    frame: 'from-orange-400 to-red-500',
    art: 'from-orange-300 to-yellow-100',
    body: 'bg-orange-50',
  },
  water: { frame: 'from-blue-400 to-sky-500', art: 'from-sky-300 to-blue-100', body: 'bg-sky-50' },
  electric: {
    frame: 'from-yellow-300 to-amber-400',
    art: 'from-yellow-200 to-amber-50',
    body: 'bg-yellow-50',
  },
  grass: {
    frame: 'from-green-400 to-emerald-500',
    art: 'from-green-300 to-lime-100',
    body: 'bg-green-50',
  },
  ice: { frame: 'from-cyan-300 to-sky-400', art: 'from-cyan-200 to-white', body: 'bg-cyan-50' },
  fighting: {
    frame: 'from-red-600 to-orange-700',
    art: 'from-red-300 to-orange-100',
    body: 'bg-red-50',
  },
  poison: {
    frame: 'from-purple-500 to-fuchsia-600',
    art: 'from-purple-300 to-fuchsia-100',
    body: 'bg-purple-50',
  },
  ground: {
    frame: 'from-amber-500 to-yellow-700',
    art: 'from-amber-300 to-yellow-100',
    body: 'bg-amber-50',
  },
  flying: {
    frame: 'from-indigo-300 to-sky-400',
    art: 'from-indigo-200 to-sky-50',
    body: 'bg-indigo-50',
  },
  psychic: {
    frame: 'from-pink-400 to-fuchsia-500',
    art: 'from-pink-300 to-fuchsia-100',
    body: 'bg-pink-50',
  },
  bug: {
    frame: 'from-lime-400 to-green-600',
    art: 'from-lime-300 to-green-100',
    body: 'bg-lime-50',
  },
  rock: {
    frame: 'from-stone-400 to-stone-600',
    art: 'from-stone-300 to-stone-100',
    body: 'bg-stone-50',
  },
  ghost: {
    frame: 'from-violet-600 to-purple-800',
    art: 'from-violet-300 to-purple-100',
    body: 'bg-violet-50',
  },
  dragon: {
    frame: 'from-indigo-600 to-orange-500',
    art: 'from-indigo-300 to-orange-100',
    body: 'bg-indigo-50',
  },
  dark: {
    frame: 'from-gray-700 to-gray-900',
    art: 'from-gray-400 to-gray-200',
    body: 'bg-gray-100',
  },
  steel: {
    frame: 'from-slate-400 to-slate-600',
    art: 'from-slate-300 to-slate-100',
    body: 'bg-slate-50',
  },
  fairy: {
    frame: 'from-pink-300 to-rose-400',
    art: 'from-pink-200 to-rose-50',
    body: 'bg-rose-50',
  },
}

// Gaya cadangan: dipakai saat data belum datang atau type tidak dikenal
const DEFAULT_CARD: CardStyle = {
  frame: 'from-gray-300 to-gray-400',
  art: 'from-gray-200 to-gray-100',
  body: 'bg-gray-50',
}

export function getCardStyle(type?: string): CardStyle {
  return (type && CARD_STYLES[type]) || DEFAULT_CARD
}
