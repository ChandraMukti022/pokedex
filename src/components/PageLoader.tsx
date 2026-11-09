import Pokeball from './Pokeball'

interface PageLoaderProps {
  label?: string
}

export default function PageLoader({ label = 'Memuat...' }: PageLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[50vh] flex-col items-center justify-center gap-3"
    >
      <Pokeball tone="gray" className="animate-wobble h-20 w-20" />
      {/* Bayangan di bawah bola */}
      <div className="h-2 w-16 animate-pulse rounded-full bg-gray-300/70" />
      <p className="text-sm font-medium text-gray-500">{label}</p>
    </div>
  )
}
