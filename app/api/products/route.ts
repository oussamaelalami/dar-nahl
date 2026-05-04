import { NextRequest, NextResponse } from 'next/server'
import { productSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { DEMO_PRODUCTS } = await import('@/lib/demo-data')
    return NextResponse.json({ products: DEMO_PRODUCTS })
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { searchParams } = new URL(request.url)
  const activeOnly = searchParams.get('active') !== 'false'

  let query = supabase.from('products').select('*').order('created_at', { ascending: false })
  if (activeOnly) query = query.eq('active', true)

  const { data: products, error } = await query

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }

  return NextResponse.json({ products })
}

export async function POST(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body   = await request.json()
    const parsed = productSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert(parsed.data)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
    }

    return NextResponse.json({ product }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
