import { formatName } from '../utils/pokemon'

interface TypeFilterProps {
  types: string[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export default function TypeFilter({ types, value, onChange, disabled }: TypeFilterProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      aria-label="Filter berdasarkan type"
      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none disabled:opacity-50 sm:w-48"
    >
      <option value="">Semua type</option>
      {types.map((type) => (
        <option key={type} value={type}>
          {formatName(type)}
        </option>
      ))}
    </select>
  )
}