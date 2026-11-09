interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-xl bg-red-50 p-8 text-center">
      <h2 className="text-lg font-semibold text-red-700">Terjadi kesalahan</h2>
      <p className="mt-1 text-red-600">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Coba lagi
        </button>
      )}
    </div>
  )
}
