'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { ArrowDown, Sparkles, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function HeroSection() {
  const t      = useTranslations('hero')
  const locale = useLocale()
  const isAr   = locale === 'ar'

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden honeycomb-bg">
      {/* Layered background */}
      <div className="absolute inset-0 bg-honey-radial" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(217,155,8,0.15),transparent)]" />

      {/* Floating honey blob decorations */}
      <div className="absolute top-1/4 start-[8%] h-72 w-72 rounded-full bg-honey-400/10 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 end-[8%] h-80 w-80 rounded-full bg-honey-600/10 blur-3xl animate-float [animation-delay:2s]" />
      <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-honey-300/8 blur-3xl" />

      {/* Hexagonal ornament top-right */}
      <svg
        className="absolute top-20 end-12 w-32 h-32 text-honey-400/20 animate-spin-slow hidden lg:block"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <polygon points="50,3 97,25 97,75 50,97 3,75 3,25" />
      </svg>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 text-center pt-24 pb-16">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-honey-300/60 bg-honey-100/80 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-honey-800 shadow-sm animate-fade-in">
          <Sparkles className="h-3.5 w-3.5 text-honey-600" />
          {t('badge')}
          <Sparkles className="h-3.5 w-3.5 text-honey-600" />
        </div>

        {/* Main title */}
        <h1
          className={cn(
            'mb-4 font-heading font-bold text-honey-950 leading-tight animate-slide-up',
            isAr ? 'text-5xl sm:text-6xl md:text-7xl font-arabic' : 'text-6xl sm:text-7xl md:text-8xl',
          )}
        >
          <span className="honey-text">{t('title')}</span>
        </h1>

        {/* Subtitle */}
        <p
          className={cn(
            'mx-auto mb-10 max-w-2xl text-honey-800/80 leading-relaxed animate-slide-up [animation-delay:100ms]',
            isAr ? 'text-lg sm:text-xl font-arabic' : 'text-lg sm:text-xl',
          )}
        >
          {t('subtitle')}
        </p>

        {/* Social proof stars */}
        <div className="flex items-center justify-center gap-1.5 mb-10 animate-fade-in [animation-delay:200ms]">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-honey-500 text-honey-500" />
          ))}
          <span className="ms-2 text-sm font-medium text-honey-700">
            {locale === 'ar' ? '+500 عميل راضٍ' : '+500 clients satisfaits'}
          </span>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up [animation-delay:200ms]">
          <Button asChild size="xl" className="w-full sm:w-auto min-w-[200px] text-base">
            <Link href="/products">{t('cta')}</Link>
          </Button>
          <Button asChild size="xl" variant="outline" className="w-full sm:w-auto min-w-[200px] text-base">
            <Link href="/order">{t('ctaOrder')}</Link>
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex flex-col items-center gap-2 text-honey-700/50 animate-bounce">
          <span className="text-xs uppercase tracking-widest">{t('scroll')}</span>
          <ArrowDown className="h-4 w-4" />
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 inset-x-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 40 C360 80 1080 0 1440 40 L1440 80 L0 80 Z"
            fill="rgb(var(--honey-50, 255 253 240) / 1)"
            className="fill-honey-50"
          />
        </svg>
      </div>
    </section>
  )
}
