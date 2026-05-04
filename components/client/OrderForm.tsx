'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations, useLocale } from 'next-intl'
import { Plus, Trash2, Phone, User, MapPin, FileText, ShoppingBag, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCart } from './CartContext'
import { orderSchema, type OrderFormValues } from '@/lib/validations'
import { formatPrice, getProductName, MOROCCAN_CITIES } from '@/lib/utils'
import type { Product, Locale } from '@/types'
import { cn } from '@/lib/utils'

interface OrderFormProps {
  products: Product[]
}

export function OrderForm({ products }: OrderFormProps) {
  const t      = useTranslations('order.form')
  const tVal   = useTranslations('order.validation')
  const tOrder = useTranslations('order')
  const locale = useLocale() as Locale
  const { items: cartItems, clearCart } = useCart()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const defaultItems = cartItems.length > 0
    ? cartItems.map((ci) => ({ product_id: ci.product.id, quantity: ci.quantity }))
    : [{ product_id: '', quantity: 1 }]

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: { customer_name: '', phone: '', city: '', address: '', notes: '', items: defaultItems },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  const watchedItems = watch('items')
  const total = watchedItems.reduce((sum, item) => {
    const p = products.find((pr) => pr.id === item.product_id)
    return sum + (p ? p.price * item.quantity : 0)
  }, 0)

  const onSubmit = async (data: OrderFormValues) => {
    setStatus('loading')
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      clearCart()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4 animate-scale-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-honey-gradient shadow-honey-lg">
          <span className="text-4xl">🍯</span>
        </div>
        <h2 className={cn(
          'text-3xl font-bold text-honey-900',
          locale === 'ar' ? 'font-arabic font-heading' : 'font-heading',
        )}>
          {t('success')}
        </h2>
        <p className={cn('text-honey-700/70', locale === 'ar' && 'font-arabic')}>
          {locale === 'ar'
            ? 'سنتصل بك قريباً لتأكيد طلبك.'
            : 'Notre équipe vous contactera très bientôt par téléphone.'}
        </p>
      </div>
    )
  }

  const isAr = locale === 'ar'

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      {/* Info banner */}
      <div className="flex gap-3 rounded-2xl border border-honey-200/60 bg-honey-100/60 p-4">
        <Info className="h-5 w-5 text-honey-600 shrink-0 mt-0.5" />
        <div>
          <p className={cn('text-sm font-semibold text-honey-800', isAr && 'font-arabic')}>
            {tOrder('info')}
          </p>
          <p className={cn('text-xs text-honey-700/60 mt-0.5', isAr && 'font-arabic')}>
            {tOrder('infoDesc')}
          </p>
        </div>
      </div>

      {/* Personal info */}
      <div className="rounded-3xl border border-honey-200/60 bg-white/80 shadow-card p-6 space-y-5">
        <h2 className={cn(
          'font-bold text-honey-900 flex items-center gap-2',
          isAr ? 'text-xl font-arabic' : 'font-heading text-2xl',
        )}>
          <User className="h-5 w-5 text-honey-600" />
          {t('personalInfo')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="customer_name">{t('name')} *</Label>
            <Input
              id="customer_name"
              placeholder={t('namePlaceholder')}
              {...register('customer_name')}
              className={errors.customer_name ? 'border-red-400' : ''}
            />
            {errors.customer_name && (
              <p className="text-xs text-red-500">{tVal(errors.customer_name.message as any)}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="phone">{t('phone')} *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder={t('phonePlaceholder')}
              dir="ltr"
              {...register('phone')}
              className={errors.phone ? 'border-red-400' : ''}
            />
            {errors.phone && (
              <p className="text-xs text-red-500">{tVal(errors.phone.message as any)}</p>
            )}
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <Label htmlFor="city">{t('city')} *</Label>
            <Select onValueChange={(v) => setValue('city', v)}>
              <SelectTrigger id="city" className={errors.city ? 'border-red-400' : ''}>
                <SelectValue placeholder={t('cityPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {MOROCCAN_CITIES.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.city && (
              <p className="text-xs text-red-500">{tVal(errors.city.message as any)}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <Label htmlFor="address">{t('address')}</Label>
            <Input
              id="address"
              placeholder={t('addressPlaceholder')}
              {...register('address')}
            />
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="rounded-3xl border border-honey-200/60 bg-white/80 shadow-card p-6 space-y-5">
        <h2 className={cn(
          'font-bold text-honey-900 flex items-center gap-2',
          isAr ? 'text-xl font-arabic' : 'font-heading text-2xl',
        )}>
          <ShoppingBag className="h-5 w-5 text-honey-600" />
          {t('products')}
        </h2>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-3 items-start">
              <div className="flex-1">
                <Select
                  value={watchedItems[index]?.product_id}
                  onValueChange={(v) => setValue(`items.${index}.product_id`, v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectProduct')} />
                  </SelectTrigger>
                  <SelectContent>
                    {products.filter((p) => p.active && p.stock > 0).map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        <span className={isAr ? 'font-arabic' : ''}>
                          {getProductName(p, locale)}
                        </span>
                        <span className="ms-2 text-honey-700/50 text-xs">
                          {formatPrice(p.price, locale)}/kg
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-1">
                <Label className="sr-only">{t('quantity')}</Label>
                <Input
                  type="number"
                  min={1}
                  max={99}
                  className="w-20 text-center"
                  {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                />
              </div>

              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label={t('removeProduct')}
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {errors.items && (
          <p className="text-xs text-red-500">{tVal('productsRequired')}</p>
        )}

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => append({ product_id: '', quantity: 1 })}
          className="gap-2"
        >
          <Plus className="h-3.5 w-3.5" />
          {t('addProduct')}
        </Button>

        {/* Total */}
        {total > 0 && (
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-honey-200/60 bg-honey-50 px-5 py-3">
            <span className={cn('font-semibold text-honey-800', isAr && 'font-arabic')}>
              {t('total')}
            </span>
            <span className="text-xl font-bold text-honey-700">
              {formatPrice(total, locale)}
            </span>
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="rounded-3xl border border-honey-200/60 bg-white/80 shadow-card p-6 space-y-3">
        <h2 className={cn(
          'font-bold text-honey-900 flex items-center gap-2',
          isAr ? 'text-xl font-arabic' : 'font-heading text-2xl',
        )}>
          <FileText className="h-5 w-5 text-honey-600" />
          {t('notes')}
        </h2>
        <Textarea
          placeholder={t('notesPlaceholder')}
          rows={3}
          {...register('notes')}
        />
      </div>

      {/* Submit */}
      {status === 'error' && (
        <p className={cn('text-sm text-red-500 text-center', isAr && 'font-arabic')}>
          {t('error')}
        </p>
      )}

      <Button
        type="submit"
        size="xl"
        className="w-full"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? t('submitting') : t('submit')}
      </Button>
    </form>
  )
}
