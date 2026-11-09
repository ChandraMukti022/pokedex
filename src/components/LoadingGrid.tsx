interface LoadingGridProps {
  count?: number
}

export default function LoadingGrid({ count = 20 }: LoadingGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-xl bg-white p-4 shadow">
          <div className="aspect-square w-full rounded bg-gray-200" />
          <div className="mt-2 h-3 w-1/3 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-2/3 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  )
}