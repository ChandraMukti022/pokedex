interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const buttonClass =
    'rounded-lg bg-white px-4 py-2 shadow disabled:cursor-not-allowed disabled:opacity-50'

  return (
    <div className="mt-6 flex items-center justify-center gap-4">
      <button
        className={buttonClass}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Sebelumnya
      </button>
      <span className="text-sm text-gray-600">
        Halaman {page} dari {totalPages}
      </span>
      <button
        className={buttonClass}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Berikutnya
      </button>
    </div>
  )
}