import type { FormEvent } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void // dipanggil saat tombol Cari / Enter ditekan
}

export default function SearchBar({ value, onChange, onSubmit }: SearchBarProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit?.()
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex w-full gap-2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur focus-within:ring-2 focus-within:ring-gray-900/30"
    >
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Cari nama Pokémon..."
        aria-label="Cari Pokémon"
        className="min-w-0 flex-1 bg-transparent px-4 py-2 text-base focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-full bg-gray-900 px-6 py-2.5 font-semibold text-white transition hover:bg-gray-700"
      >
        Cari
      </button>
    </form>
  )
}
