'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { OrdersTable } from '@/components/admin/OrdersTable'
import { createClient } from '@/lib/supabase/client'
import { DEMO_ORDERS } from '@/lib/demo-data'
import type { Order, OrderStatus, Locale } from '@/types'
import { cn } from '@/lib/utils'

export default function OrdersPage() {
  const t      = useTranslations('admin.orders')
  const locale = useLocale() as Locale
  const isAr   = locale === 'ar'
  const [orders, setOrders] = useState<Order[]>(DEMO_ORDERS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        setLoading(false)
        return
      }
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
        if (data) setOrders(data as Order[])
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
    )
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return
    const supabase = createClient()
    await supabase.from('orders').update({ status }).eq('id', orderId)
  }

  const handleDelete = async (orderId: string) => {
    if (!confirm(t('confirmDelete'))) return
    setOrders((prev) => prev.filter((o) => o.id !== orderId))
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return
    const supabase = createClient()
    await supabase.from('orders').delete().eq('id', orderId)
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
