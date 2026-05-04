'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Plus } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { ProductsTable } from '@/components/admin/ProductsTable'
import { ProductForm } from '@/components/admin/ProductForm'
import { createClient } from '@/lib/supabase/client'
import { DEMO_PRODUCTS } from '@/lib/demo-data'
import type { Product, Locale } from '@/types'
import type { ProductFormValues } from '@/lib/validations'
import { cn } from '@/lib/utils'

export default function AdminProductsPage() {
  const t      = useTranslations('admin.products')
  const locale = useLocale() as Locale
  const isAr   = locale === 'ar'
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS)
  const [loading, setLoading]   = useState(true)
  const [editing, setEditing]   = useState<Product | null>(null)
  const [saving, setSaving]     = useState(false)

  useEffect(() => {
    async function load() {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) { setLoading(false); return }
      try {
        const supabase = createClient()
        const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
        if (data) setProducts(data as Product[])
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async (data: ProductFormValues) => {
    setSaving(true)
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const supabase = createClient()
        if (editing) {
          const { data: updated } = await supabase
            .from('products')
            .update({ ...data, updated_at: new Date().toISOString() })
            .eq('id', editing.id)
            .select()
            .single()
          if (updated) setProducts((prev) => prev.map((p) => p.id === editing.id ? updated : p))
        } else {
          const { data: created } = await supabase.from('products').insert(data).select().single()
          if (created) setProducts((prev) => [created, ...prev])
        }
      } else {
        if (editing) {
          setProducts((prev) =>
            prev.map((p) => p.id === editing.id ? { ...p, ...data } : p),
          )
        } else {
          const newProduct: Product = {
            ...data,
            id: `demo-${Date.now()}`,
            description_fr: data.description_fr ?? null,
            description_ar: data.description_ar ?? null,
            image_url: data.image_url ?? null,
            weight: data.weight ?? null,
            origin: data.origin ?? null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          setProducts((prev) => [newProduct, ...prev])
        }
      }
      setEditing(null)
    } catch {}
    setSaving(false)
  }

  const handleToggleActive = async (productId: string, active: boolean) => {
    setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, active } : p))
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return
    const supabase = createClient()
    await supabase.from('products').update({ active }).eq('id', productId)
  }

  const handleDelete = async (productId: string) => {
    if (!confirm(t('confirmDelete'))) return
    setProducts((prev) => prev.filter((p) => p.id !== productId))
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return
    const supabase = createClient()
    await supabase.from('products').delete().eq('id', productId)
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <h1 className={cn(
          'font-bold text-honey-950',
          isAr ? 'text-3xl font-arabic' : 'font-heading text-4xl',
        )}>
          {t('title')}
        </h1>
        <Button
          onClick={() => setEditing({} as Product)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          <span className={isAr ? 'font-arabic' : ''}>{t('add')}</span>
        </Button>
      </div>

      {/* Edit / Create modal-like panel */}
      {editing !== null && (
        <div className="rounded-3xl border border-honey-200/60 bg-white/90 shadow-honey p-6 sm:p-8">
          <h2 className={cn(
            'mb-6 font-bold text-honey-900',
            isAr ? 'text-xl font-arabic' : 'font-heading text-2xl',
          )}>
            {editing.id ? t('form.editTitle') : t('form.title')}
          </h2>
          <ProductForm
            product={editing.id ? editing : undefined}
            onSubmit={handleSave}
            onCancel={() => setEditing(null)}
            isLoading={saving}
          />
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-14 rounded-2xl bg-honey-100/60 animate-pulse" />
          ))}
        </div>
      ) : (
        <ProductsTable
          products={products}
          onEdit={(p) => setEditing(p)}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
        />
      )}
    </div>
  )
}
