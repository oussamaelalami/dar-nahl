'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Hexagon, Phone, MessageCircle, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Footer() {
  const t      = useTranslations('footer')
  const tNav   = useTranslations('nav')
  const locale = useLocale()
  const isAr   = locale === 'ar'

  return (
    <footer className="relative border-t border-honey-200/60 bg-honey-950 text-honey-100 overflow-hidden">
      {/* Background hex pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="honeycomb-bg w-full h-full" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-honey-gradient shadow-honey">
                <Hexagon className="h-5 w-5 fill-white/30 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <div className="font-heading text-xl font-bold text-honey-50">Dar Nahl</div>
                <div className={cn('text-xs text-honey-400', isAr ? 'font-arabic' : '')}>دار النحل</div>
              </div>
            </div>
            <p className={cn(
              'text-sm text-honey-300/70 leading-relaxed max-w-xs',
              isAr && 'font-arabic',
            )}>
              {t('tagline')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className={cn(
              'mb-4 font-semibold text-honey-100',
              isAr && 'font-arabic',
            )}>
              {t('links')}
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: '/',         label: tNav('home') },
                { href: '/products', label: tNav('products') },
                { href: '/order',    label: tNav('order') },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      'text-sm text-honey-300/70 hover:text-honey-300 transition-colors cursor-pointer',
                      isAr && 'font-arabic',
                    )}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={cn(
              'mb-4 font-semibold text-honey-100',
              isAr && 'font-arabic',
            )}>
              {t('contact')}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+212600000000"
                  className="flex items-center gap-3 text-sm text-honey-300/70 hover:text-honey-300 transition-colors cursor-pointer"
                >
                  <Phone className="h-4 w-4 text-honey-500 shrink-0" />
                  <span>+212 6XX XXX XXX</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/212600000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-honey-300/70 hover:text-honey-300 transition-colors cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4 text-honey-500 shrink-0" />
                  <span>WhatsApp</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@darnahl.ma"
                  className="flex items-center gap-3 text-sm text-honey-300/70 hover:text-honey-300 transition-colors cursor-pointer"
                >
                  <Mail className="h-4 w-4 text-honey-500 shrink-0" />
                  <span>contact@darnahl.ma</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-honey-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className={cn(
            'text-xs text-honey-400/60',
            isAr && 'font-arabic',
          )}>
            © {new Date().getFullYear()} Dar Nahl. {t('rights')}
          </p>
          <p className="text-xs text-honey-400/40">{t('madeIn')}</p>
        </div>
      </div>
    </footer>
  )
}
