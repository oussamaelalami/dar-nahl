import { getTranslations, getLocale } from 'next-intl/server'
import { Navbar } from '@/components/client/Navbar'
import { OrderForm } from '@/components/client/OrderForm'
import { Footer } from '@/components/client/Footer'
import { CartProvider } from '@/components/client/CartContext'
import { createClient } from '@/lib/supabase/server'
import { DEMO_PRODUCTS } from '@/lib/demo-data'
import type { Product } from '@/types'
import { cn } from '@/lib/utils'

async function getProducts(): Promise<Product[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return DEMO_PRODUCTS
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select('id, name_fr, name_ar, price, category, stock, active, image_url, description_fr, description_ar, weight, origin, created_at, updated_at')
      .eq('active', true)
      .gt('stock', 0)
      .order('name_fr')
    return data ?? DEMO_PRODUCTS
  } catch {
    return DEMO_PRODUCTS
  }
}

export default async function OrderPage() {
  const locale   = await getLocale()
  const t        = await getTranslations('order')
  const products = await getProducts()
  const isAr     = locale === 'ar'

  return (
    <CartProvider>
      <Navbar />

      <main className="min-h-screen pt-28">
        {/* Header */}
        <div className="relative overflow-hidden honeycomb-bg py-16">
          <div className="absolute inset-0 bg-honey-radial" />
          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 text-center">
            <h1 className={cn(
              'mb-3 font-bold text-honey-950',
              isAr ? 'text-5xl font-arabic' : 'font-heading text-6xl',
            )}>
              {t('title')}
            </h1>
            <p className={cn(
              'text-honey-700/70',
              isAr ? 'text-base font-arabic' : 'text-lg',
            )}>
              {t('subtitle')}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16">
          <OrderForm products={products} />
        </div>
      </main>

      <Footer />
    </CartProvider>
  )
}
