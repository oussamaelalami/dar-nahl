'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatPrice, getProductName } from '@/lib/utils'
import type { Product, Locale } from '@/types'
import { cn } from '@/lib/utils'

interface ProductsTableProps {
  products: Product[]
  onEdit?: (product: Product) => void
  onDelete?: (productId: string) => void
  onToggleActive?: (productId: string, active: boolean) => void
}

export function ProductsTable({ products, onEdit, onDelete, onToggleActive }: ProductsTableProps) {
  const t      = useTranslations('admin.products')
  const tCat   = useTranslations('products')
  const locale = useLocale() as Locale
  const isAr   = locale === 'ar'

  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-honey-200/60 bg-white/80 py-16 text-center">
        <p className={cn('text-honey-700/60', isAr && 'font-arabic')}>{t('noProducts')}</p>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-honey-200/60 bg-white/80 shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-honey-100 bg-honey-50/50">
              {[t('name'), t('price'), t('category'), t('stock'), t('status'), t('actions')].map((h) => (
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
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-honey-50/50 transition-colors">
                <td className={cn('px-4 py-3 font-medium text-honey-900', isAr && 'font-arabic')}>
                  {getProductName(product, locale)}
                </td>
                <td className="px-4 py-3 font-semibold text-honey-700">
                  {formatPrice(product.price, locale)}
                </td>
                <td className="px-4 py-3">
                  <Badge variant="secondary" className={isAr ? 'font-arabic' : ''}>
                    {tCat(product.category as any)}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-honey-700">
                  <span className={product.stock === 0 ? 'text-red-500 font-medium' : ''}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={product.active ? 'success' : 'destructive'}>
                    <span className={isAr ? 'font-arabic' : ''}>
                      {product.active ? t('active') : t('inactive')}
                    </span>
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {onToggleActive && (
                      <button
                        onClick={() => onToggleActive(product.id, !product.active)}
                        aria-label={t('toggleStatus')}
                        title={t('toggleStatus')}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-honey-500 hover:bg-honey-50 hover:text-honey-700 transition-colors cursor-pointer"
                      >
                        {product.active
                          ? <ToggleRight className="h-4 w-4 text-green-500" />
                          : <ToggleLeft className="h-4 w-4 text-honey-400" />
                        }
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(product)}
                        aria-label={t('edit')}
                        title={t('edit')}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-honey-500 hover:bg-honey-50 hover:text-honey-700 transition-colors cursor-pointer"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(product.id)}
                        aria-label={t('delete')}
                        title={t('delete')}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
