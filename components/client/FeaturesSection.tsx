'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Leaf, Truck, Award, History } from 'lucide-react'
import { cn } from '@/lib/utils'

const ICONS = [Leaf, Truck, Award, History]
const KEYS  = ['natural', 'delivery', 'quality', 'heritage'] as const

export function FeaturesSection() {
  const t      = useTranslations('features')
  const locale = useLocale()
  const isAr   = locale === 'ar'

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className={cn(
            'font-heading font-bold text-honey-950',
            isAr ? 'text-4xl font-arabic' : 'text-5xl sm:text-6xl',
          )}>
            {t('title')}
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-honey-gradient" />
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {KEYS.map((key, i) => {
            const Icon = ICONS[i]
            return (
              <div
                key={key}
                className={cn(
                  'group relative rounded-3xl p-6 border border-honey-200/60 bg-white/80 shadow-card',
                  'hover:shadow-honey hover:-translate-y-1 transition-all duration-300',
                  'overflow-hidden',
                )}
              >
                {/* Background glow */}
                <div className="absolute -top-8 -start-8 h-32 w-32 rounded-full bg-honey-400/10 blur-2xl group-hover:bg-honey-400/20 transition-all duration-500" />

                {/* Icon */}
                <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-honey-gradient shadow-honey">
                  <Icon className="h-6 w-6 text-white" strokeWidth={1.5} />
                </div>

                <h3 className={cn(
                  'mb-2 font-bold text-honey-900',
                  isAr ? 'text-lg font-arabic' : 'font-heading text-2xl',
                )}>
                  {t(`${key}.title`)}
                </h3>
                <p className={cn(
                  'text-sm text-honey-700/70 leading-relaxed',
                  isAr && 'font-arabic',
                )}>
                  {t(`${key}.desc`)}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
