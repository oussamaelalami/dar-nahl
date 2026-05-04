'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { productSchema, type ProductFormValues } from '@/lib/validations'
import { PRODUCT_CATEGORIES } from '@/types'
import type { Product } from '@/types'
import { cn } from '@/lib/utils'

interface ProductFormProps {
  product?: Product
  onSubmit: (data: ProductFormValues) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function ProductForm({ product, onSubmit, onCancel, isLoading }: ProductFormProps) {
  const t    = useTranslations('admin.products.form')
  const tCat = useTranslations('products')
  const locale = useLocale()
  const isAr   = locale === 'ar'

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name_fr: product.name_fr,
          name_ar: product.name_ar,
          description_fr: product.description_fr ?? '',
          description_ar: product.description_ar ?? '',
          price: product.price,
          image_url: product.image_url ?? '',
          category: product.category,
          weight: product.weight ?? '',
          origin: product.origin ?? '',
          stock: product.stock,
          active: product.active,
        }
      : { active: true, stock: 0, price: 0 },
  })

  const activeValue = watch('active')

  const Field = ({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) => (
    <div className="space-y-1.5">
      <Label htmlFor={id} className={isAr ? 'font-arabic' : ''}>{label}</Label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Names */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field id="name_fr" label={t('nameFr')} error={errors.name_fr?.message}>
          <Input id="name_fr" placeholder="Miel de Thym" {...register('name_fr')} />
        </Field>
        <Field id="name_ar" label={t('nameAr')} error={errors.name_ar?.message}>
          <Input id="name_ar" placeholder="عسل الزعتر" dir="rtl" className="font-arabic" {...register('name_ar')} />
        </Field>
      </div>

      {/* Descriptions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field id="description_fr" label={t('descFr')}>
          <Textarea id="description_fr" placeholder="Description en français..." rows={3} {...register('description_fr')} />
        </Field>
        <Field id="description_ar" label={t('descAr')}>
          <Textarea id="description_ar" placeholder="الوصف بالعربية..." dir="rtl" rows={3} className="font-arabic" {...register('description_ar')} />
        </Field>
      </div>

      {/* Price, Category, Stock */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Field id="price" label={t('price')} error={errors.price?.message}>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            {...register('price', { valueAsNumber: true })}
          />
        </Field>

        <Field id="category" label={t('category')} error={errors.category?.message}>
          <Select
            defaultValue={product?.category}
            onValueChange={(v) => setValue('category', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="—" />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {tCat(cat as any)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field id="stock" label={t('stock')} error={errors.stock?.message}>
          <Input
            id="stock"
            type="number"
            min="0"
            {...register('stock', { valueAsNumber: true })}
          />
        </Field>
      </div>

      {/* Weight, Origin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field id="weight" label={t('weight')}>
          <Input id="weight" placeholder="500g – 1kg" {...register('weight')} />
        </Field>
        <Field id="origin" label={t('origin')}>
          <Input id="origin" placeholder="Haut Atlas, Maroc" {...register('origin')} />
        </Field>
      </div>

      {/* Image */}
      <Field id="image_url" label={t('imageUrl')} error={errors.image_url?.message}>
        <Input id="image_url" type="url" placeholder="https://..." {...register('image_url')} />
      </Field>

      {/* Active toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={activeValue}
          onClick={() => setValue('active', !activeValue)}
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer',
            activeValue ? 'bg-honey-600' : 'bg-honey-200',
          )}
        >
          <span
            className={cn(
              'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
              activeValue ? 'translate-x-6' : 'translate-x-1',
            )}
          />
        </button>
        <Label className={cn('cursor-pointer', isAr && 'font-arabic')} onClick={() => setValue('active', !activeValue)}>
          {t('active')}
        </Label>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            <span className={isAr ? 'font-arabic' : ''}>{t('cancel')}</span>
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          <span className={isAr ? 'font-arabic' : ''}>
            {isLoading ? t('saving') : t('save')}
          </span>
        </Button>
      </div>
    </form>
  )
}
