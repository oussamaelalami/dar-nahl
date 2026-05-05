'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { ShoppingCart, MapPin, Weight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from './CartContext'
import { formatPrice, getProductName, getProductDescription } from '@/lib/utils'
import type { Product, Locale } from '@/types'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  className?: string
  showcase?: boolean
}

const CATEGORY_EMOJI: Record<string, string> = {
  thyme:     '🌿',
  sidr:      '🌳',
  mountain:  '⛰️',
  wildflower:'🌸',
  argan:     '🫒',
  euphorbe:  '🌵',
}

export function ProductCard({ product, className, showcase = false }: ProductCardProps) {
  const t      = useTranslations('products')
  const locale = useLocale() as Locale
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const name        = getProductName(product, locale)
  const description = getProductDescription(product, locale)
  const categoryKey = `products.${product.category}` as const
  const categoryEmoji = CATEGORY_EMOJI[product.category] ?? '🍯'

  const handleAdd = () => {
    if (product.stock === 0) return
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <article
      className={cn(
        'group relative flex flex-col rounded-3xl border border-honey-200/60 bg-white/85 shadow-card',
        'hover:shadow-honey hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer',
        className,
      )}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-honey-100 rounded-t-3xl">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-honey-gradient">
            <span className="text-6xl animate-float">{categoryEmoji}</span>
          </div>
        )}

        {/* Stock badge */}
        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-t-3xl">
            <span className="rounded-xl bg-white/90 px-3 py-1 text-sm font-semibold text-honey-900">
              {t('outOfStock')}
            </span>
          </div>
        )}

        {/* Category pill */}
        <div className="absolute top-3 start-3">
          <Badge variant="secondary" className="glass border-honey-200/60 backdrop-blur-sm text-honey-800">
            {categoryEmoji} {t(product.category as any)}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className={cn(
          'mb-1.5 text-lg font-bold text-honey-950 leading-tight',
          locale === 'ar' ? 'font-arabic text-xl' : 'font-heading text-2xl',
        )}>
          {name}
        </h3>

        {description && (
          <p className={cn(
            'mb-3 line-clamp-2 text-sm text-honey-700/70 leading-relaxed',
            locale === 'ar' && 'font-arabic',
          )}>
            {description}
          </p>
        )}

        {/* Meta */}
        <div className="mt-auto space-y-2">
          {product.origin && (
            <div className="flex items-center gap-1.5 text-xs text-honey-700/60">
              <MapPin className="h-3 w-3" />
              <span>{product.origin}</span>
            </div>
          )}
          {product.weight && (
            <div className="flex items-center gap-1.5 text-xs text-honey-700/60">
              <Weight className="h-3 w-3" />
              <span>{product.weight}</span>
            </div>
          )}
        </div>

        {/* Price + Add */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <span className="text-2xl font-bold text-honey-800">
              {formatPrice(product.price, locale)}
            </span>
            <span className="ms-1 text-xs text-honey-700/50">{t('perKg')}</span>
          </div>

          {!showcase && (
            <Button
              size="sm"
              variant={added ? 'secondary' : 'default'}
              disabled={product.stock === 0}
              onClick={handleAdd}
              className={cn(
                'rounded-xl gap-1.5 transition-all duration-200',
                added && 'bg-green-100 text-green-700 border-green-200',
              )}
            >
              {added ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  {t('addedToCart')}
                </>
              ) : (
                <>
                  <ShoppingCart className="h-3.5 w-3.5" />
                  {t('order')}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}
