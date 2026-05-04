'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Eye, Trash2, ChevronDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatPrice, formatDate } from '@/lib/utils'
import type { Order, OrderStatus, Locale } from '@/types'
import { cn } from '@/lib/utils'

const STATUS_ORDER: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

interface OrdersTableProps {
  orders: Order[]
  onStatusChange?: (orderId: string, status: OrderStatus) => void
  onDelete?: (orderId: string) => void
}

export function OrdersTable({ orders, onStatusChange, onDelete }: OrdersTableProps) {
  const t      = useTranslations('admin.orders')
  const locale = useLocale() as Locale
  const isAr   = locale === 'ar'
  const [filter, setFilter] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  const statusVariant = (status: OrderStatus) => {
    const map: Record<OrderStatus, any> = {
      pending:   'pending',
      confirmed: 'confirmed',
      shipped:   'shipped',
      delivered: 'delivered',
      cancelled: 'cancelled',
    }
    return map[status]
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className={cn('text-sm font-medium text-honey-700', isAr && 'font-arabic')}>
          {t('filter')}:
        </span>
        <div className="flex flex-wrap gap-2">
          {['all', ...STATUS_ORDER].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer border',
                isAr && 'font-arabic',
                filter === s
                  ? 'bg-honey-gradient text-white border-transparent shadow-honey'
                  : 'bg-white text-honey-700 border-honey-200 hover:bg-honey-50',
              )}
            >
              {s === 'all' ? t('all') : t(`statuses.${s}` as any)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-honey-200/60 bg-white/80 py-16 text-center">
          <p className={cn('text-honey-700/60', isAr && 'font-arabic')}>{t('noOrders')}</p>
        </div>
      ) : (
        <div className="rounded-3xl border border-honey-200/60 bg-white/80 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-honey-100 bg-honey-50/50">
                  {[t('id'), t('customer'), t('phone'), t('city'), t('total'), t('status'), t('date'), t('actions')].map((h) => (
                    <th
                      key={h}
                      className={cn(
                        'whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-honey-700/60',
                        isAr ? 'text-end font-arabic' : 'text-start',
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-honey-100">
                {filtered.map((order) => (
                  <>
                    <tr
                      key={order.id}
                      className="hover:bg-honey-50/50 transition-colors cursor-pointer"
                      onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-honey-700/60">
                        #{order.order_number}
                      </td>
                      <td className={cn('px-4 py-3 font-medium text-honey-900', isAr && 'font-arabic')}>
                        {order.customer_name}
                      </td>
                      <td className="px-4 py-3 text-honey-700/70 font-mono text-xs" dir="ltr">
                        {order.phone}
                      </td>
                      <td className={cn('px-4 py-3 text-honey-700/70', isAr && 'font-arabic')}>
                        {order.city}
                      </td>
                      <td className="px-4 py-3 font-semibold text-honey-800">
                        {formatPrice(order.total, locale)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusVariant(order.status)}>
                          <span className={isAr ? 'font-arabic' : ''}>
                            {t(`statuses.${order.status}` as any)}
                          </span>
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-honey-700/50 whitespace-nowrap">
                        {formatDate(order.created_at, locale)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {onStatusChange && (
                            <Select
                              value={order.status}
                              onValueChange={(v) => onStatusChange(order.id, v as OrderStatus)}
                            >
                              <SelectTrigger className="h-8 w-32 text-xs rounded-lg">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {STATUS_ORDER.map((s) => (
                                  <SelectItem key={s} value={s}>
                                    <span className={isAr ? 'font-arabic text-xs' : 'text-xs'}>
                                      {t(`statuses.${s}` as any)}
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(order.id)}
                              aria-label={t('delete')}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <ChevronDown
                            className={cn(
                              'h-4 w-4 text-honey-400 transition-transform cursor-pointer',
                              expandedId === order.id && 'rotate-180',
                            )}
                          />
                        </div>
                      </td>
                    </tr>

                    {/* Expanded row */}
                    {expandedId === order.id && (
                      <tr key={`${order.id}-detail`} className="bg-honey-50/30">
                        <td colSpan={8} className="px-6 py-4">
                          <div className="space-y-3">
                            <h4 className={cn('font-semibold text-honey-800 text-sm', isAr && 'font-arabic')}>
                              {isAr ? 'تفاصيل الطلب' : 'Détails de la commande'}
                            </h4>
                            <div className="space-y-1.5">
                              {order.items.map((item, i) => (
                                <div key={i} className="flex items-center justify-between text-sm text-honey-700">
                                  <span className={isAr ? 'font-arabic' : ''}>
                                    {isAr ? item.product_name_ar : item.product_name_fr}
                                    <span className="ms-2 text-honey-700/50">× {item.quantity}</span>
                                  </span>
                                  <span className="font-medium">
                                    {formatPrice(item.unit_price * item.quantity, locale)}
                                  </span>
                                </div>
                              ))}
                            </div>
                            {order.address && (
                              <p className={cn('text-xs text-honey-700/60', isAr && 'font-arabic')}>
                                📍 {order.address}
                              </p>
                            )}
                            {order.notes && (
                              <p className={cn('text-xs text-honey-700/60 italic', isAr && 'font-arabic')}>
                                💬 {order.notes}
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
