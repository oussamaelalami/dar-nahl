'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ShoppingCart, Menu, X, Hexagon } from 'lucide-react'
import { useCart } from './CartContext'
import { LanguageSwitcher } from './LanguageSwitcher'
import { cn } from '@/lib/utils'

export function Navbar() {
  const t       = useTranslations('nav')
  const locale  = useLocale()
  const { totalItems } = useCart()
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '/',         label: t('home') },
    { href: '/products', label: t('products') },
    { href: '/order',    label: t('order') },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'top-0 py-0 bg-white/90 shadow-card backdrop-blur-md border-b border-honey-100'
          : 'top-3 py-1',
      )}
    >
      <nav
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6',
          scrolled ? 'h-16' : 'h-16 mx-4 sm:mx-6 rounded-2xl glass shadow-glass',
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-honey-gradient shadow-honey">
            <Hexagon className="h-5 w-5 fill-white/30 text-white" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-heading text-xl font-bold text-honey-900 group-hover:text-honey-700 transition-colors">
              Dar Nahl
            </span>
            <span className={cn('text-[10px] text-honey-700/60', locale === 'ar' ? 'font-arabic' : '')}>
              {locale === 'ar' ? 'دار النحل' : 'دار النحل'}
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl px-4 py-2 text-sm font-medium text-honey-800 hover:bg-honey-100 hover:text-honey-900 transition-all duration-150 cursor-pointer"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher className="hidden sm:flex" />

          {/* Cart button */}
          <Link
            href="/order"
            aria-label={t('cart')}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-honey-200/80 bg-white/70 text-honey-800 hover:bg-honey-50 hover:border-honey-300 transition-all duration-200 cursor-pointer shadow-sm"
          >
            <ShoppingCart className="h-4.5 w-4.5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -end-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-honey-600 text-[10px] font-bold text-white shadow-honey">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-honey-200/80 bg-white/70 text-honey-800 hover:bg-honey-50 md:hidden cursor-pointer transition-all"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden mx-4 mt-1 rounded-2xl glass shadow-glass border border-honey-200/60 p-4 animate-scale-in">
          <div className="flex flex-col gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-honey-800 hover:bg-honey-100 transition-colors cursor-pointer"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-honey-100">
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  )
}
