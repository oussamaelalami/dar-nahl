import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Locale, Product } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, locale: Locale = 'fr'): string {
  const formatter = new Intl.NumberFormat(locale === 'ar' ? 'ar-MA' : 'fr-MA', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  return formatter.format(amount)
}

export function formatDate(dateString: string, locale: Locale = 'fr'): string {
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-MA' : 'fr-MA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}

export function getProductName(product: Product, locale: Locale): string {
  return locale === 'ar' ? product.name_ar : product.name_fr
}

export function getProductDescription(product: Product, locale: Locale): string {
  return locale === 'ar'
    ? product.description_ar ?? ''
    : product.description_fr ?? ''
}

export function generateOrderNumber(): string {
  return `DN-${Date.now().toString(36).toUpperCase()}`
}

export const MOROCCAN_CITIES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fès',
  'Tanger',
  'Agadir',
  'Meknès',
  'Oujda',
  'Kénitra',
  'Tétouan',
  'Safi',
  'El Jadida',
  'Nador',
  'Beni Mellal',
  'Khémisset',
  'Settat',
  'Essaouira',
  'Ouarzazate',
  'Errachidia',
  'Autre',
]
