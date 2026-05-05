import { getTranslations, getLocale } from 'next-intl/server'
import { ShoppingBag, Clock, Package, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { DEMO_ORDERS, DEMO_PRODUCTS } from '@/lib/demo-data' // only used when Supabase is not configured
import { OrdersTable } from '@/components/admin/OrdersTable'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import type { Order, Product, Locale } from '@/types'
import { cn } from '@/lib/utils'

async function getDashboardData() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { orders: DEMO_ORDERS, products: DEMO_PRODUCTS }
  }
  try {
    const supabase = await createClient()
    const [ordersRes, productsRes] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('products').select('*').eq('active', true),
    ])
    return {
      orders:   (ordersRes.data ?? []) as Order[],
      products: (productsRes.data ?? []) as Product[],
    }
  } catch {
    return { orders: [] as Order[], products: [] as Product[] }
  }
}

export default async function DashboardPage() {
  const t      = await getTranslations('admin.dashboard')
  const locale = await getLocale() as Locale
  const isAr   = locale === 'ar'

  const { orders, products } = await getDashboardData()

  const pending  = orders.filter((o) => o.status === 'pending').length
  const revenue  = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0)
  const recent   = orders.slice(0, 5)

  const stats = [
    {
      label: t('totalOrders'),
      value: orders.length,
      icon: ShoppingBag,
      color: 'bg-honey-gradient',
      textColor: 'text-white',
    },
    {
      label: t('pendingOrders'),
      value: pending,
      icon: Clock,
      color: 'bg-amber-100',
      textColor: 'text-amber-800',
    },
    {
      label: t('totalProducts'),
      value: products.length,
      icon: Package,
      color: 'bg-honey-100',
      textColor: 'text-honey-800',
    },
    {
      label: t('revenue'),
      value: formatPrice(revenue, locale),
      icon: TrendingUp,
      color: 'bg-green-100',
      textColor: 'text-green-800',
    },
  ]

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className={cn(
          'font-bold text-honey-950',
          isAr ? 'text-3xl font-arabic' : 'font-heading text-4xl',
        )}>
          {t('title')}
        </h1>
        <p className={cn('mt-1 text-sm text-honey-700/60', isAr && 'font-arabic')}>
          {isAr ? 'مرحباً بك في لوحة تحكم دار النحل' : 'Bienvenue dans votre espace d\'administration'}
        </p>
      </div>

      {/* Stats bento grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(({ label, value, icon: Icon, color, textColor }) => (
          <div
            key={label}
            className={cn(
              'relative rounded-3xl p-6 border border-honey-200/40 shadow-card overflow-hidden',
              color,
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className={cn(
                  'text-sm font-medium opacity-70',
                  textColor,
                  isAr && 'font-arabic',
                )}>
                  {label}
                </p>
                <p className={cn(
                  'mt-1 text-3xl font-bold',
                  textColor,
                )}>
                  {value}
                </p>
              </div>
              <div className={cn(
                'flex h-10 w-10 items-center justify-center rounded-2xl',
                color === 'bg-honey-gradient' ? 'bg-white/20' : 'bg-white/60',
              )}>
                <Icon className={cn('h-5 w-5', textColor)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className={cn(
            'font-bold text-honey-900',
            isAr ? 'text-xl font-arabic' : 'font-heading text-2xl',
          )}>
            {t('recentOrders')}
          </h2>
        </div>
        <OrdersTable orders={recent} />
      </div>
    </div>
  )
}
