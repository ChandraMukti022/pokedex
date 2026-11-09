import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import PageLoader from './PageLoader'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-gray-50 text-gray-900">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 p-4">
        {/* Saat file halaman baru dimuat, tampilkan loader di area konten */}
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
