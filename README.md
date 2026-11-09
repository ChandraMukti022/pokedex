# Pokédex

Aplikasi web Pokédex berbasis React yang mengambil data dari [PokéAPI](https://pokeapi.co/docs/v2).
Dibuat sebagai Frontend Technical Assessment.

**Demo:** GANTI-dengan-link-deployment (opsional, hapus baris ini kalau tidak ada)

## Fitur

- **Beranda**: hero yang berganti-ganti Pokémon acak, kotak pencarian, chip type, dan "Pilihan acak"
- **Jelajahi** (`/pokedex`): daftar Pokémon (gambar, nama, ID) dengan pagination
- Pencarian nama dan filter type (bisa digabung)
- **Detail**: type, abilities, height, weight, dan base stats
- **Favorites**: tambah/hapus, halaman terpisah, tetap tersimpan setelah refresh
- Responsive (desktop dan mobile), dengan state loading, error, dan empty
- State pencarian, filter, dan halaman tersimpan di URL, jadi bisa dibagikan dan aman saat refresh

## Teknologi

| Teknologi | Alasan |
|---|---|
| React + TypeScript + Vite | Sesuai requirement |
| Tailwind CSS (v4, via plugin Vite) | Styling cepat dan konsisten |
| React Router | Routing dan state di URL (`useSearchParams`) |
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

## Rute

| Path | Halaman |
|---|---|
| `/` | Beranda (hero, chip type, pilihan acak) |
| `/pokedex` | Listing + search + filter type + pagination |
| `/pokemon/:id` | Detail Pokémon |
| `/favorites` | Daftar favorit |
| `*` | Halaman 404 |

Parameter URL di `/pokedex`: `q` (kata kunci), `type`, dan `page`.
Contoh: `/pokedex?q=char&type=fire&page=2`.

Setiap halaman dimuat dengan `React.lazy` (code splitting), dan `Suspense` di `Layout` menampilkan loader saat file halaman sedang diunduh.

## Struktur Project

```
src/
├── api/
│   └── pokeapi.ts            # semua fungsi fetch ke PokéAPI
├── components/               # komponen UI yang dipakai ulang
│   ├── Layout.tsx            # kerangka: Navbar + konten (Suspense) + Footer
│   ├── Navbar.tsx            # navigasi + badge jumlah favorit
│   ├── Footer.tsx
│   ├── HomeHero.tsx          # hero beranda: search + slide otomatis
│   ├── FeaturedPokemon.tsx   # satu slide di hero
│   ├── PokemonCard.tsx       # kartu Pokémon (listing, favorit, beranda)
│   ├── FavoriteButton.tsx    # tombol hati (terhubung ke store)
│   ├── SearchBar.tsx
│   ├── TypeFilter.tsx        # grid 18 type, klik lagi untuk batal
│   ├── Pagination.tsx
│   ├── TypeBadge.tsx         # label type resmi (fallback ke teks)
│   ├── StatBar.tsx           # bar base stat
│   ├── Pokeball.tsx          # ikon SVG
│   ├── PageLoader.tsx        # state: loading
│   ├── ErrorState.tsx        # state: error (+ tombol coba lagi)
│   └── EmptyState.tsx        # state: kosong
├── hooks/                    # hook TanStack Query per jenis data
│   ├── usePokemonIndex.ts    # daftar semua Pokémon (ID + nama)
│   ├── usePokemonIdsByType.ts
│   ├── usePokemonDetail.ts
│   └── useTypes.ts
├── pages/                    # satu file per halaman/rute
│   ├── HomePage.tsx
│   ├── PokedexPage.tsx
│   ├── PokemonDetailPage.tsx
│   ├── FavoritesPage.tsx
│   └── NotFoundPage.tsx
├── store/
│   └── favoritesStore.ts     # Zustand store (favorites)
├── types/
│   └── pokemon.ts            # tipe TypeScript response API
├── utils/
│   ├── pokemon.ts            # extractId, buildImageUrl, format nama/ID/satuan
│   ├── typeStyles.ts         # warna kartu per type
│   ├── typeIcons.ts          # URL ikon type
│   └── typeLabels.ts         # nama type dalam Bahasa Indonesia
├── App.tsx                   # daftar rute
├── main.tsx                  # provider (QueryClient, Router)
└── index.css                 # Tailwind + animasi
```

Alur data: **page → hook → fungsi API**. Komponen tidak memanggil `fetch` langsung.
Satu pengecualian yang disengaja: `PokemonCard` dan `FeaturedPokemon` memakai hook `usePokemonDetail` sendiri, supaya tiap kartu mengambil datanya sendiri dan memanfaatkan cache bersama.

## Pendekatan State Management

State dipisah berdasarkan jenisnya, supaya tidak ada data ganda:

| Jenis | Isi | Alat |
|---|---|---|
| Server state | Daftar Pokémon, daftar type, ID per type, detail | TanStack Query (cache + loading/error otomatis) |
| Global client state | Favorites (hanya array ID) | Zustand + `persist` |
| URL state | `q`, `type`, `page` | `useSearchParams` (React Router) |
| Local state | Isi kotak search yang sedang diketik, slide aktif hero, ID acak beranda | `useState` |

Keputusan penting:

- **Favorites hanya menyimpan ID**, bukan objek Pokémon. Nama dan data lain diambil dari cache TanStack Query, jadi tidak ada salinan data yang bisa tidak sinkron. Store memakai `partialize` sehingga hanya `ids` yang ditulis ke localStorage (key `pokedex-favorites`).
- **Search, filter, dan halaman disimpan di URL**, bukan di store. Hasilnya bisa dibagikan lewat link, tetap utuh saat refresh, dan tombol Back berfungsi wajar.
- **Kotak search memakai local state + debounce 300 ms**, sehingga mengetik terasa langsung tanpa memproses setiap huruf. Tombol Cari atau Enter menerapkan kata kunci seketika. Saat mengetik, URL diperbarui dengan `replace` agar riwayat browser tidak penuh.
- **Cache TanStack Query**: `staleTime` default 5 menit, dan `Infinity` untuk data yang tidak berubah (indeks, type, detail). `refetchOnWindowFocus` dimatikan dan `retry` diatur 1 kali.

## Catatan Integrasi API

Endpoint yang dipakai: `GET /pokemon?limit=1025`, `GET /type`, `GET /type/{name}`, dan `GET /pokemon/{id}`.

PokéAPI punya beberapa keterbatasan yang memengaruhi desain:

1. `GET /pokemon` hanya mengembalikan `name` dan `url` (tanpa gambar dan ID). ID diambil dari ujung URL, dan gambar official artwork dibangun dari pola URL berdasarkan ID, jadi gambar tidak butuh request tambahan.
2. Tidak ada endpoint pencarian nama. Indeks lengkap (1025 Pokémon, hanya nama + URL) diambil **sekali**, di-cache, lalu difilter di client dengan pencocokan sebagian nama (spasi diubah menjadi `-`, mis. "mr mime" cocok dengan `mr-mime`).
3. Filter type memakai `GET /type/{name}` (di luar daftar endpoint di soal), karena `GET /type` hanya memberi nama type. Daftar ID hasilnya diiriskan dengan hasil pencarian nama.
4. Pagination dilakukan di client (20 item per halaman), karena `limit/offset` bawaan API tidak bisa digabung dengan search dan filter. Nomor halaman di URL otomatis dibatasi ke rentang yang valid.
5. **Data kartu (HP, ability, tinggi, berat, type) membutuhkan request detail.** Daftar `/pokemon` tidak memuatnya, sehingga setiap kartu memanggil `GET /pokemon/{id}`. Artinya ada sekitar 20 request detail per halaman. Dampaknya dibatasi oleh:
   - cache TanStack Query (`staleTime: Infinity`), jadi Pokémon yang sudah pernah dimuat tidak diminta ulang
   - cache yang sama dipakai halaman detail, jadi membuka detail dari kartu langsung tampil
   - gambar kartu memakai `loading="lazy"`
   - kartu menampilkan kerangka (skeleton) sampai datanya datang
6. ID di atas 1025 (form khusus seperti mega dan gmax) dikecualikan. Type `unknown`, `shadow`, dan `stellar` tidak ditampilkan di filter karena tidak punya Pokémon biasa.
7. Satuan API dikonversi: height (desimeter) dan weight (hektogram) dibagi 10 menjadi meter dan kg.

## UI/UX

- Responsive: grid kartu 2 kolom (mobile), 3 (tablet), 4 (desktop). Pagination meringkas menjadi "Halaman X dari Y" di mobile.
- State loading (`PageLoader`, skeleton), error (`ErrorState` dengan tombol Coba lagi), dan empty (hasil pencarian kosong, belum ada favorit, ID tidak valid, 404).
- Tombol Kembali di halaman detail memakai riwayat browser, jadi filter dan halaman sebelumnya tetap terjaga.
- Aksesibilitas dasar: `aria-label`, `aria-pressed`, `aria-current`, dan animasi dimatikan untuk pengguna dengan `prefers-reduced-motion`.

## Screenshot

| Halaman | Gambar |
|---|---|
| Beranda | ![Beranda](screenshots/01-home.png) |
| Jelajahi + search + filter | ![Search dan filter](screenshots/02-search-filter.png) |
| Hasil tidak ditemukan | ![Empty state](screenshots/03-empty-state.png) |
| Detail | ![Detail](screenshots/04-detail.png) |
| Favorites | ![Favorites](screenshots/05-favorites.png) |
| Tampilan mobile | ![Mobile](screenshots/06-mobile.png) |

## Pengembangan Lanjutan

- Unit test (Vitest + Testing Library) untuk helper dan store
- Prefetch detail Pokémon saat kartu di-hover
- Error boundary global
- Mengurangi request detail per kartu, misalnya lewat endpoint GraphQL PokéAPI
- Virtualisasi daftar kalau data bertambah besar