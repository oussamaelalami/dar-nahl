'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale  = useLocale()
  const router  = useRouter()
  const pathname = usePathname()

  const toggle = () => {
    router.replace(pathname, { locale: locale === 'fr' ? 'ar' : 'fr' })
  }

  return (
    <button
      onClick={toggle}
      aria-label="Changer de langue / تغيير اللغة"
      className={cn(
        'flex items-center gap-1.5 rounded-xl border border-honey-200/80 bg-white/70 px-3 py-1.5',
        'text-sm font-semibold text-honey-800 hover:bg-honey-50 hover:border-honey-300',
        'transition-all duration-200 cursor-pointer shadow-sm',
        className,
      )}
    >
      <span className="text-base leading-none">
        {locale === 'fr' ? '🇲🇦' : '🇫🇷'}
      </span>
      <span className={locale === 'ar' ? 'font-arabic' : ''}>
        {locale === 'fr' ? 'عربي' : 'Français'}
      </span>
    </button>
  )
}
