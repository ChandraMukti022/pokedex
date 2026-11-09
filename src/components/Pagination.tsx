interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

type PageItem = number | 'ellipsis-start' | 'ellipsis-end'

// Contoh: 1 2 3 4 … 52  |  1 … 9 10 11 … 52  |  1 … 49 50 51 52
function getPageItems(page: number, total: number): PageItem[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (page <= 3) return [1, 2, 3, 4, 'ellipsis-end', total]
  if (page >= total - 2) return [1, 'ellipsis-start', total - 3, total - 2, total - 1, total]
  return [1, 'ellipsis-start', page - 1, page, page + 1, 'ellipsis-end', total]
}

const arrowClass =
  'flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition hover:bg-white hover:shadow disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none'

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  )
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <nav aria-label="Navigasi halaman" className="mt-8 flex items-center justify-center gap-1">
      <button
        type="button"
        className={arrowClass}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Halaman sebelumnya"
      >
        <Chevron direction="left" />
      </button>

      {/* Mobile: ringkas, karena nomor halaman tidak muat */}
      <span className="px-3 text-sm text-gray-600 sm:hidden">
        Halaman {page} dari {totalPages}
      </span>

      {/* Tablet ke atas: nomor halaman */}
      <div className="hidden items-center gap-1 sm:flex">
        {getPageItems(page, totalPages).map((item) =>
          typeof item === 'number' ? (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-label={`Halaman ${item}`}
              aria-current={item === page ? 'page' : undefined}
              className={`h-10 min-w-10 rounded-lg px-2 text-sm font-medium transition ${
                item === page
                  ? 'bg-white shadow ring-1 ring-black/10'
                  : 'text-gray-600 hover:bg-white hover:shadow'
              }`}
            >
              {item}
            </button>
          ) : (
            <span key={item} className="w-8 text-center text-gray-400" aria-hidden="true">
              …
            </span>
          ),
        )}
      </div>

      <button
        type="button"
        className={arrowClass}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Halaman berikutnya"
      >
        <Chevron direction="right" />
      </button>
    </nav>
  )
}
