import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'

export default function NotFoundPage() {
  return (
    <div className="space-y-4 text-center">
      <EmptyState
        title="404 - Halaman tidak ditemukan"
        description="Alamat yang kamu buka tidak tersedia."
      />
      <Link
        to="/"
        className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Kembali ke beranda
      </Link>
    </div>
  )
}
