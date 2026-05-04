import type { ReactNode } from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-honey-50">
      <AdminSidebar />
      <div className="lg:ps-64 pt-16 lg:pt-0">
        <main className="min-h-screen p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
