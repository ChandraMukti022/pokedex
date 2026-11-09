// Satu item di daftar (list) Pokémon: hanya nama dan URL
export interface NamedResource {
  name: string
  url: string
}

// Response dari GET /pokemon?limit=..&offset=..
export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: NamedResource[]
}

// Response dari GET /type
export interface TypeListResponse {
  results: NamedResource[]
}

// Response dari GET /type/{name}
export interface TypeDetailResponse {
  pokemon: {
    pokemon: NamedResource
    slot: number
  }[]
}

// Response dari GET /pokemon/{id}
export interface PokemonDetail {
  id: number
  name: string
  height: number
  weight: number
  types: {
    slot: number
    type: NamedResource
  }[]
  abilities: {
    ability: NamedResource
    is_hidden: boolean
    slot: number
  }[]
  stats: {
    base_stat: number
    stat: NamedResource
  }[]
  sprites: {
    other?: {
      'official-artwork'?: {
        front_default: string | null
      }
    }
  }
}

// Bentuk ringan yang kita pakai di halaman listing
export interface PokemonSummary {
  id: number
  name: string
}