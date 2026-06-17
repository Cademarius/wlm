import { createBrowserClient } from '@supabase/ssr'
import { supabaseAnonConfig } from '@/lib/env'

export function createClient() {
  const { url, anonKey } = supabaseAnonConfig()
  return createBrowserClient(url, anonKey)
}
