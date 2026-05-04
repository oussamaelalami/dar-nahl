import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'
import type { CookieOptions } from '@supabase/ssr'

const intlMiddleware = createMiddleware(routing)

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const isAdminRoute = routing.locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/admin`) &&
      !pathname.includes('/admin/login'),
  )

  if (isAdminRoute) {
    const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey) {
      const { createServerClient } = await import('@supabase/ssr')
      const response = NextResponse.next({ request })

      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) =>
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options as any),
            ),
        },
      })

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        const locale =
          routing.locales.find((l) => pathname.startsWith(`/${l}/`)) ??
          routing.defaultLocale
        return NextResponse.redirect(
          new URL(`/${locale}/admin/login`, request.url),
        )
      }
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
