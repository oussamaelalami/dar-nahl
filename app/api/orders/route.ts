import { NextRequest, NextResponse } from 'next/server'
import { orderSchema } from '@/lib/validations'
import { DEMO_PRODUCTS } from '@/lib/demo-data'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = orderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const { customer_name, phone, city, address, items, notes } = parsed.data

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ success: true, demo: true })
    }

    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data: products } = await supabase
      .from('products')
      .select('id, name_fr, name_ar, price')
      .in('id', items.map((i) => i.product_id))

    const productMap = new Map((products ?? []).map((p) => [p.id, p]))

    const orderItems = items.map((item) => {
      const product = productMap.get(item.product_id)
      return {
        product_id:      item.product_id,
        product_name_fr: product?.name_fr ?? '',
        product_name_ar: product?.name_ar ?? '',
        quantity:        item.quantity,
        unit_price:      product?.price ?? 0,
      }
    })

    const subtotal = orderItems.reduce((sum, i) => sum + i.unit_price * i.quantity, 0)

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        customer_name,
        phone,
        city,
        address:  address ?? null,
        items:    orderItems,
        subtotal,
        total:    subtotal,
        notes:    notes ?? null,
        status:   'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Order creation error:', error)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    return NextResponse.json({ success: true, order }, { status: 201 })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ orders: [] })
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }

  return NextResponse.json({ orders })
}
