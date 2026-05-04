import { z } from 'zod'

export const orderSchema = z.object({
  customer_name: z
    .string()
    .min(2, 'nameMin')
    .max(100),
  phone: z
    .string()
    .min(1, 'phoneRequired')
    .regex(/^(\+212|0)[5-7]\d{8}$/, 'phoneInvalid'),
  city: z.string().min(1, 'cityRequired').max(100),
  address: z.string().max(300).optional(),
  notes: z.string().max(500).optional(),
  items: z
    .array(
      z.object({
        product_id: z.string().uuid(),
        quantity: z.number().int().positive().max(100),
      }),
    )
    .min(1, 'productsRequired'),
})

export type OrderFormValues = z.infer<typeof orderSchema>

export const productSchema = z.object({
  name_fr: z.string().min(2).max(200),
  name_ar: z.string().min(2).max(200),
  description_fr: z.string().max(1000).optional(),
  description_ar: z.string().max(1000).optional(),
  price: z.number().positive().max(10000),
  image_url: z.string().url().optional().or(z.literal('')),
  category: z.string().min(1),
  weight: z.string().max(50).optional(),
  origin: z.string().max(200).optional(),
  stock: z.number().int().min(0).max(10000),
  active: z.boolean(),
})

export type ProductFormValues = z.infer<typeof productSchema>

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export type LoginFormValues = z.infer<typeof loginSchema>
