'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Hexagon, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginFormValues } from '@/lib/validations'
import { cn } from '@/lib/utils'

export default function AdminLoginPage() {
  const t      = useTranslations('admin.login')
  const locale = useLocale()
  const router = useRouter()
  const isAr   = locale === 'ar'
  const [showPwd, setShowPwd]     = useState(false)
  const [authErr, setAuthErr]     = useState(false)
  const [authErrMsg, setAuthErrMsg] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginFormValues) => {
    setAuthErr(false)
    setAuthErrMsg('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email:    data.email,
      password: data.password,
    })
    if (error) {
      setAuthErr(true)
      setAuthErrMsg(error.message)
      return
    }
    router.refresh()
    router.replace('/admin/dashboard')
  }

  return (
    <div className="min-h-screen honeycomb-bg flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-honey-radial" />

      <div className="relative w-full max-w-md animate-scale-in">
        {/* Card */}
        <div className="rounded-3xl border border-honey-200/60 bg-white/90 shadow-honey-lg backdrop-blur-sm p-8 sm:p-10">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-honey-gradient shadow-honey">
              <Hexagon className="h-7 w-7 fill-white/30 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className={cn(
                'font-bold text-honey-950',
                isAr ? 'text-2xl font-arabic' : 'font-heading text-4xl',
              )}>
                {t('title')}
              </h1>
              <p className={cn('mt-1 text-sm text-honey-700/60', isAr && 'font-arabic')}>
                {t('subtitle')}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className={isAr ? 'font-arabic' : ''}>{t('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('emailPlaceholder')}
                autoComplete="email"
                dir="ltr"
                {...register('email')}
                className={errors.email ? 'border-red-400' : ''}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className={isAr ? 'font-arabic' : ''}>{t('password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="current-password"
                  dir="ltr"
                  {...register('password')}
                  className={cn('pe-11', errors.password ? 'border-red-400' : '')}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-honey-700/40 hover:text-honey-700 transition-colors cursor-pointer"
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {authErr && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                <span className={isAr ? 'font-arabic' : ''}>{authErrMsg || t('error')}</span>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              <span className={isAr ? 'font-arabic' : ''}>
                {isSubmitting ? t('submitting') : t('submit')}
              </span>
            </Button>
          </form>

          {/* Back */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className={cn(
                'inline-flex items-center gap-1.5 text-sm text-honey-600/70 hover:text-honey-700 transition-colors cursor-pointer',
                isAr && 'font-arabic flex-row-reverse',
              )}
            >
              <ArrowLeft className={cn('h-3.5 w-3.5', isAr && 'rotate-180')} />
              {t('backToSite')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
