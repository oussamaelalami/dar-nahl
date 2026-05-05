'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { ProductCard } from './ProductCard'
import type { Product } from '@/types'
import { cn } from '@/lib/utils'
import { PRODUCT_CATEGORIES } from '@/types'

interface ProductGridProps {
  products: Product[]
  showFilter?: boolean
  maxItems?: number
  showcase?: boolean
}

export function ProductGrid({ products, showFilter = true, maxItems, showcase = false }: ProductGridProps) {
  const t      = useTranslations('products')
  const locale = useLocale()
  const isAr   = locale === 'ar'
  const [activeFilter, setActiveFilter] = useState<string>('all')

  const filtered = activeFilter === 'all'
    ? products
    : products.filter((p) => p.category === activeFilter)

  const displayed = maxItems ? filtered.slice(0, maxItems) : filtered

  const filters = [
    { key: 'all', label: t('all') },
    ...PRODUCT_CATEGORIES.map((cat) => ({ key: cat, label: t(cat as any) })),
  ]

  return (
    <div className="space-y-8">
      {showFilter && (
        <div
          className="flex flex-wrap justify-center gap-2"
          role="tablist"
          aria-label={locale === 'ar' ? 'تصفية المنتجات' : 'Filtrer les produits'}
        >
          {filters.map(({ key, label }) => (
            <button
              key={key}
              role="tab"
              aria-selected={activeFilter === key}
              onClick={() => setActiveFilter(key)}
              className={cn(
                'rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer border',
                isAr && 'font-arabic',
                activeFilter === key
                  ? 'bg-honey-gradient text-white border-transparent shadow-honey'
                  : 'bg-white/80 text-honey-700 border-honey-200/80 hover:bg-honey-50 hover:border-honey-300',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {displayed.length === 0 ? (
        <div className="py-20 text-center">
          <p className={cn('text-honey-700/60', isAr && 'font-arabic')}>{t('noProducts')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayed.map((product, i) => (
            <div
              key={product.id}
              className="animate-slide-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <ProductCard product={product} showcase={showcase} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
