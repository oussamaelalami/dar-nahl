'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import {
  LayoutDashboard, ShoppingBag, Package, LogOut, Menu, X,
  Hexagon, ExternalLink,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  icon: React.ElementType
  labelKey: 'dashboard' | 'orders' | 'products' | 'logout' | 'site'
}

const NAV_ITEMS: NavItem[] = [
  { href: '/admin/dashboard', icon: LayoutDashboard, labelKey: 'dashboard' },
  { href: '/admin/orders',    icon: ShoppingBag,     labelKey: 'orders' },
  { href: '/admin/products',  icon: Package,          labelKey: 'products' },
]

export function AdminSidebar() {
  const t        = useTranslations('admin.nav')
  const locale   = useLocale()
  const router   = useRouter()
  const pathname = usePathname()
  const isAr     = locale === 'ar'
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/admin/login')
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-honey-100">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-honey-gradient shadow-honey shrink-0">
          <Hexagon className="h-5 w-5 fill-white/30 text-white" strokeWidth={1.5} />
        </div>
        <div>
          <div className="font-heading font-bold text-honey-900 text-lg leading-none">Dar Nahl</div>
          <div className={cn('text-[10px] text-honey-600/60', isAr && 'font-arabic')}>
            {isAr ? 'لوحة التحكم' : 'Administration'}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Admin navigation">
        {NAV_ITEMS.map(({ href, icon: Icon, labelKey }) => {
          const segment  = href.split('/').pop() ?? ''
          const isActive = pathname.includes(segment)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-150 cursor-pointer',
                isAr && 'font-arabic',
                isActive
                  ? 'bg-honey-gradient text-white shadow-honey'
                  : 'text-honey-700 hover:bg-honey-50 hover:text-honey-900',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {t(labelKey)}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-honey-100 space-y-1">
        <Link
          href="/"
          target="_blank"
          className={cn(
            'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-honey-600/70 hover:bg-honey-50 hover:text-honey-700 transition-all cursor-pointer',
            isAr && 'font-arabic',
          )}
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          {t('site')}
        </Link>
        <button
          onClick={handleLogout}
          className={cn(
            'flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-all cursor-pointer',
            isAr && 'font-arabic',
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {t('logout')}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:start-0 lg:w-64 lg:flex-col border-e border-honey-100 bg-white/95 shadow-sm z-40">
        <SidebarContent />
      </aside>

      {/* Mobile header bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-50 flex h-16 items-center justify-between px-4 bg-white/95 border-b border-honey-100 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-honey-gradient">
            <Hexagon className="h-4 w-4 fill-white/30 text-white" strokeWidth={1.5} />
          </div>
          <span className="font-heading font-bold text-honey-900">Dar Nahl</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-honey-200 text-honey-800 hover:bg-honey-50 cursor-pointer"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 start-0 z-50 w-72 bg-white shadow-xl lg:hidden animate-scale-in">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  )
}
