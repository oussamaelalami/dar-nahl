export type Locale = 'fr' | 'ar'

export interface Product {
  id: string
  name_fr: string
  name_ar: string
  description_fr: string | null
  description_ar: string | null
  price: number
  image_url: string | null
  category: string
  weight: string | null
  origin: string | null
  stock: number
  active: boolean
  created_at: string
  updated_at: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  product_id: string
  product_name_fr: string
  product_name_ar: string
  quantity: number
  unit_price: number
}

export interface Order {
  id: string
  order_number: number
  customer_name: string
  phone: string
  city: string
  address: string | null
  items: OrderItem[]
  subtotal: number
  total: number
  status: OrderStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface CreateOrderInput {
  customer_name: string
  phone: string
  city: string
  address?: string
  items: { product_id: string; quantity: number }[]
  notes?: string
}

export interface ProductFormInput {
  name_fr: string
  name_ar: string
  description_fr?: string
  description_ar?: string
  price: number
  image_url?: string
  category: string
  weight?: string
  origin?: string
  stock: number
  active: boolean
}

export const PRODUCT_CATEGORIES = [
  'thyme',
  'sidr',
  'mountain',
  'wildflower',
  'argan',
  'euphorbe',
] as const

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending:   'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  shipped:   'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
}
