'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import type { Locale, OrderItem } from '@/types'
import { cn } from '@/lib/utils'

type Period = 'day' | 'week' | 'month'

interface ProductStat {
  product_id: string
  name_fr: string
  name_ar: string
  quantity: number
  revenue: number
}

const PERIOD_LABELS: Record<Period, { fr: string; ar: string }> = {
  day:   { fr: 'Aujourd\'hui', ar: 'اليوم' },
  week:  { fr: 'Cette semaine', ar: 'هذا الأسبوع' },
  month: { fr: 'Ce mois',       ar: 'هذا الشهر' },
}

function sinceDate(period: Period): Date {
  const d = new Date()
  if (period === 'day')   d.setDate(d.getDate() - 1)
  if (period === 'week')  d.setDate(d.getDate() - 7)
  if (period === 'month') d.setMonth(d.getMonth() - 1)
  return d
}

export function BestSellers() {
  const locale = useLocale() as Locale
  const isAr   = locale === 'ar'
  const [period, setPeriod]   = useState<Period>('week')
  const [stats, setStats]     = useState<ProductStat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const supabase = createClient()
      const { data: orders } = await supabase
        .from('orders')
        .select('items, status')
        .gte('created_at', sinceDate(period).toISOString())
        .neq('status', 'cancelled')

      if (!orders) { setLoading(false); return }

      const agg: Record<string, ProductStat> = {}
      orders.forEach((order) => {
        ;(order.items as OrderItem[]).forEach((item) => {
          if (!agg[item.product_id]) {
            agg[item.product_id] = {
              product_id: item.product_id,
              name_fr:    item.product_name_fr,
              name_ar:    item.product_name_ar,
              quantity:   0,
              revenue:    0,
            }
          }
          agg[item.product_id].quantity += item.quantity
          agg[item.product_id].revenue  += item.unit_price * item.quantity
        })
      })

      setStats(
        Object.values(agg)
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5),
      )
      setLoading(false)
    }
    load()
  }, [period])

  const maxQty = stats[0]?.quantity ?? 1

  return (
    <div className="rounded-3xl border border-honey-200/60 bg-white/80 shadow-card p-6">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className={cn(
          'flex items-center gap-2 font-bold text-honey-900',
          isAr ? 'text-xl font-arabic' : 'font-heading text-2xl',
        )}>
          <TrendingUp className="h-5 w-5 text-honey-600" />
          {isAr ? 'الأكثر مبيعاً' : 'Meilleures ventes'}
        </h2>

        {/* Period tabs */}
        <div className="flex gap-1.5">
          {(['day', 'week', 'month'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer border',
                isAr && 'font-arabic',
                period === p
                  ? 'bg-honey-gradient text-white border-transparent shadow-honey'
                  : 'bg-white text-honey-700 border-honey-200 hover:bg-honey-50',
              )}
            >
              {PERIOD_LABELS[p][locale]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 rounded-xl bg-honey-100/60 animate-pulse" />
          ))}
        </div>
      ) : stats.length === 0 ? (
        <p className={cn('py-8 text-center text-sm text-honey-700/50', isAr && 'font-arabic')}>
          {isAr ? 'لا توجد مبيعات في هذه الفترة' : 'Aucune vente sur cette période'}
        </p>
      ) : (
        <ol className="space-y-3">
          {stats.map((s, idx) => (
            <li key={s.product_id} className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-honey-100 text-xs font-bold text-honey-700">
                {idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className={cn('truncate text-sm font-medium text-honey-900', isAr && 'font-arabic')}>
                    {isAr ? s.name_ar : s.name_fr}
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-honey-700">
                    {s.quantity} {isAr ? 'وحدة' : 'unités'} · {formatPrice(s.revenue, locale)}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-honey-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-honey-gradient transition-all duration-500"
                    style={{ width: `${(s.quantity / maxQty) * 100}%` }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
