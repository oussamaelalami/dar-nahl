'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductsTable } from '@/components/admin/ProductsTable'
import { ProductForm } from '@/components/admin/ProductForm'
import { createClient } from '@/lib/supabase/client'
import type { Product, Locale } from '@/types'
import type { ProductFormValues } from '@/lib/validations'
import { cn } from '@/lib/utils'

export default function AdminProductsPage() {
  const t      = useTranslations('admin.products')
  const locale = useLocale() as Locale
  const isAr   = locale === 'ar'
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)
  const [editing, setEditing]   = useState<Product | null>(null)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient()
        const { data, error: dbErr } = await supabase.from('products').select('*').order('created_at', { ascending: false })
        if (dbErr) throw dbErr
        setProducts((data ?? []) as Product[])
      } catch (err: any) {
        console.error('Failed to load products:', err)
        setError(err?.message ?? 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSave = async (data: ProductFormValues) => {
    setSaving(true)
    setError(null)
    try {
      const supabase = createClient()
      if (editing?.id) {
        const { data: updated, error: dbErr } = await supabase
          .from('products')
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', editing.id)
          .select()
          .single()
        if (dbErr) throw dbErr
        if (updated) setProducts((prev) => prev.map((p) => p.id === editing.id ? updated : p))
      } else {
        const { data: created, error: dbErr } = await supabase.from('products').insert(data).select().single()
        if (dbErr) throw dbErr
        if (created) setProducts((prev) => [created, ...prev])
      }
      setEditing(null)
    } catch (err: any) {
      console.error('Save failed:', err)
      setError(err?.message ?? 'Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (productId: string, active: boolean) => {
    setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, active } : p))
    const supabase = createClient()
    const { error: dbErr } = await supabase.from('products').update({ active }).eq('id', productId)
    if (dbErr) {
      console.error('Toggle active failed:', dbErr)
      setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, active: !active } : p))
      setError(dbErr.message)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm(t('confirmDelete'))) return
    const supabase = createClient()
    const { error: dbErr } = await supabase.from('products').delete().eq('id', productId)
    if (dbErr) {
      console.error('Delete failed:', dbErr)
      setError(dbErr.message)
      return
    }
    setProducts((prev) => prev.filter((p) => p.id !== productId))
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

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

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
