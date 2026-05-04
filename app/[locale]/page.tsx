import { getTranslations, getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Navbar } from '@/components/client/Navbar'
import { HeroSection } from '@/components/client/HeroSection'
import { FeaturesSection } from '@/components/client/FeaturesSection'
import { ProductGrid } from '@/components/client/ProductGrid'
import { Footer } from '@/components/client/Footer'
import { CartProvider } from '@/components/client/CartContext'
import { Button } from '@/components/ui/button'
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
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
    return data ?? DEMO_PRODUCTS
  } catch {
    return DEMO_PRODUCTS
  }
}

export default async function HomePage() {
  const locale   = await getLocale()
  const t        = await getTranslations('products')
  const tHero    = await getTranslations('hero')
  const products = await getProducts()
  const isAr     = locale === 'ar'
  const featured = products.filter((p) => p.active).slice(0, 3)

  return (
    <CartProvider>
      <Navbar />

      <main>
        {/* Hero */}
        <HeroSection />

        {/* Features */}
        <FeaturesSection />

        {/* Featured products */}
        <section className="py-24 bg-honey-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <h2 className={cn(
                'font-bold text-honey-950',
                isAr ? 'text-4xl font-arabic' : 'font-heading text-5xl sm:text-6xl',
              )}>
                {t('title')}
              </h2>
              <p className={cn(
                'mx-auto mt-4 max-w-2xl text-honey-700/70',
                isAr ? 'text-base font-arabic' : 'text-lg',
              )}>
                {t('subtitle')}
              </p>
              <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-honey-gradient" />
            </div>

            <ProductGrid products={featured} showFilter={false} />

            <div className="mt-12 text-center">
              <Button asChild size="lg" variant="outline">
                <Link href="/products">{t('viewAll')}</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Order CTA banner */}
        <section className="relative overflow-hidden py-24">
          <div className="absolute inset-0 bg-honey-gradient opacity-95" />
          <div className="absolute inset-0 honeycomb-bg opacity-20" />
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <h2 className={cn(
              'mb-4 font-bold text-white',
              isAr ? 'text-4xl font-arabic' : 'font-heading text-5xl sm:text-6xl',
            )}>
              {isAr ? 'جاهز للطلب؟' : 'Prêt à commander ?'}
            </h2>
            <p className={cn(
              'mb-8 text-white/80',
              isAr ? 'text-lg font-arabic' : 'text-xl',
            )}>
              {isAr
                ? 'اطلب الآن وسنتصل بك لتأكيد طلبك وترتيب التوصيل.'
                : 'Passez votre commande maintenant et nous vous contactons pour confirmer et livrer.'}
            </p>
            <Button asChild size="xl" variant="dark" className="shadow-xl">
              <Link href="/order">{tHero('ctaOrder')}</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </CartProvider>
  )
}
