# Pokédex

Aplikasi web Pokédex berbasis React yang mengambil data dari [PokéAPI](https://pokeapi.co/docs/v2).
Dibuat sebagai Frontend Technical Assessment.

**Demo:** GANTI-dengan-link-deployment (opsional, hapus baris ini kalau tidak ada)

## Fitur

- Daftar Pokémon (gambar, nama, ID) dengan pagination
- Pencarian nama dan filter type (bisa digabung)
- Halaman detail: type, abilities, height, weight, base stats
- Favorites: tambah/hapus, halaman terpisah, tetap tersimpan setelah refresh
- Responsive (desktop dan mobile), dengan state loading, error, dan empty
- State pencarian, filter, dan halaman tersimpan di URL, jadi bisa dibagikan dan aman saat refresh

## Teknologi

| Teknologi | Alasan |
|---|---|
| React + TypeScript + Vite | Sesuai requirement |
| Tailwind CSS | Styling cepat dan konsisten |
| React Router | Routing: `/`, `/pokemon/:id`, `/favorites` |
| TanStack Query | Server state: fetching, cache, loading/error (library tambahan) |
| Zustand | Global state favorites + `persist` ke localStorage |

## Instalasi dan Menjalankan

Prasyarat: Node.js 20.19 atau lebih baru.

```bash
git clone GANTI-dengan-url-repository
cd pokedex
npm install
npm run dev
```

Buka `http://localhost:5173`.

Perintah lain:

```bash
npm run build     # build produksi (termasuk pengecekan TypeScript)
npm run preview   # jalankan hasil build
npm run lint      # cek kualitas kode dengan ESLint
```

## Struktur Project

```
src/
├── api/
│   └── pokeapi.ts          # semua fungsi fetch ke PokéAPI
├── components/             # komponen UI yang dipakai ulang
│   ├── Layout.tsx          # navbar + wadah halaman
│   ├── Navbar.tsx
│   ├── PokemonCard.tsx
│   ├── FavoriteButton.tsx
│   ├── SearchBar.tsx
│   ├── TypeFilter.tsx
│   ├── Pagination.tsx
│   ├── TypeBadge.tsx
│   ├── StatBar.tsx
│   ├── LoadingGrid.tsx     # state: loading
│   ├── ErrorState.tsx      # state: error (+ tombol coba lagi)
│   └── EmptyState.tsx      # state: kosong
├── hooks/                  # hook TanStack Query per jenis data
│   ├── usePokemonIndex.ts
│   ├── usePokemonIdsByType.ts
│   ├── usePokemonDetail.ts
│   └── useTypes.ts
├── pages/                  # satu file per halaman/rute
│   ├── HomePage.tsx
│   ├── PokemonDetailPage.tsx
│   ├── FavoritesPage.tsx
│   └── NotFoundPage.tsx
├── store/
│   └── favoritesStore.ts   # Zustand store (favorites)
├── types/
│   └── pokemon.ts          # tipe TypeScript response API
├── utils/
│   └── pokemon.ts          # helper: extractId, buildImageUrl, format
├── App.tsx                 # daftar rute
└── main.tsx                # provider (QueryClient, Router)
```

Alur data: **page → hook → fungsi API**. Komponen tidak pernah memanggil `fetch` langsung.

## Pendekatan State Management

State dipisah berdasarkan jenisnya, supaya tidak ada data ganda:

| Jenis | Isi | Alat |
|---|---|---|
| Server state | Daftar Pokémon, daftar type, detail | TanStack Query (cache + loading/error otomatis) |
| Global client state | Favorites (hanya array ID) | Zustand + `persist` |
| URL state | `q`, `type`, `page` | `useSearchParams` (React Router) |
| Local state | Isi kotak search yang sedang diketik | `useState` |

Keputusan penting:

- **Favorites hanya menyimpan ID**, bukan objek Pokémon. Nama dan gambar diambil dari cache TanStack Query, jadi tidak ada salinan data yang bisa tidak sinkron.
- **Search, filter, dan halaman disimpan di URL**, bukan di store. Hasilnya bisa dibagikan lewat link, tetap utuh saat refresh, dan tombol Back berfungsi wajar.
- **Kotak search memakai local state + debounce 300 ms**, sehingga mengetik terasa langsung tanpa memproses setiap huruf.

## Catatan Integrasi API

PokéAPI punya beberapa keterbatasan yang memengaruhi desain:

1. `GET /pokemon` hanya mengembalikan `name` dan `url` (tanpa gambar dan ID).
   ID diambil dari URL, gambar dibangun dari pola URL official artwork, jadi tidak perlu request detail per kartu.
2. Tidak ada endpoint pencarian nama. Indeks lengkap (1025 Pokémon, hanya nama + URL) diambil **sekali**, di-cache, lalu difilter di client.
3. Filter type memakai `GET /type/{name}` (di luar daftar endpoint di soal), karena `GET /type` hanya memberi nama type. Hasilnya diirisKan dengan hasil pencarian.
4. Pagination dilakukan di client, karena `limit/offset` bawaan API tidak bisa digabung dengan search dan filter.
5. ID di atas 1025 (form khusus seperti mega dan gmax) dikecualikan. Type `unknown`, `shadow`, dan `stellar` tidak ditampilkan di filter karena tidak punya Pokémon biasa.
6. Satuan API dikonversi: height (desimeter) dan weight (hektogram) dibagi 10 menjadi meter dan kg.

## Screenshot

| Halaman | Gambar |
|---|---|
| Listing | ![Listing](screenshots/01-home.png) |
| Search + filter | ![Search dan filter](screenshots/02-search-filter.png) |
| Hasil tidak ditemukan | ![Empty state](screenshots/03-empty-state.png) |
| Detail | ![Detail](screenshots/04-detail.png) |
| Favorites | ![Favorites](screenshots/05-favorites.png) |
| Tampilan mobile | ![Mobile](screenshots/06-mobile.png) |

## Pengembangan Lanjutan

- Unit test (Vitest + Testing Library) untuk helper dan store
- Prefetch detail Pokémon saat kartu di-hover
- Error boundary global
- Virtualisasi daftar kalau data bertambah besar