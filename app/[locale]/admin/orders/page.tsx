'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { OrdersTable } from '@/components/admin/OrdersTable'
import { createClient } from '@/lib/supabase/client'
import type { Order, OrderStatus, Locale } from '@/types'
import { cn } from '@/lib/utils'

export default function OrdersPage() {
  const t      = useTranslations('admin.orders')
  const locale = useLocale() as Locale
  const isAr   = locale === 'ar'
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient()
        const { data, error: dbErr } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
        if (dbErr) throw dbErr
        setOrders((data ?? []) as Order[])
      } catch (err: any) {
        console.error('Failed to load orders:', err)
        setError(err?.message ?? 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    const prev = orders.find((o) => o.id === orderId)?.status
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
    const supabase = createClient()
    const { error: dbErr } = await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', orderId)
    if (dbErr) {
      console.error('Status update failed:', dbErr)
      setError(dbErr.message)
      if (prev) setOrders((cur) => cur.map((o) => (o.id === orderId ? { ...o, status: prev } : o)))
    }
  }

  const handleDelete = async (orderId: string) => {
    if (!confirm(t('confirmDelete'))) return
    const supabase = createClient()
    const { error: dbErr } = await supabase.from('orders').delete().eq('id', orderId)
    if (dbErr) {
      console.error('Delete failed:', dbErr)
      setError(dbErr.message)
      return
    }
    setOrders((prev) => prev.filter((o) => o.id !== orderId))
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <h1 className={cn(
          'font-bold text-honey-950',
          isAr ? 'text-3xl font-arabic' : 'font-heading text-4xl',
        )}>
          {t('title')}
        </h1>
        <span className="text-sm text-honey-700/60 font-medium">
          {orders.length} {isAr ? 'طلب' : 'commandes'}
        </span>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 rounded-2xl bg-honey-100/60 animate-pulse" />
          ))}
        </div>
      ) : (
        <OrdersTable
          orders={orders}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
