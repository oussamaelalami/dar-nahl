import { createBrowserClient } from '@supabase/ssr'

function getSupabaseUrl() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL!
  // Strip any accidental path suffix (e.g. /rest/v1) — only the origin is valid
  try { return new URL(raw).origin } catch { return raw }
}

export function createClient() {
  return createBrowserClient(
    getSupabaseUrl(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
