import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL']
const supabaseAnonKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Copy .env.example to .env.local and fill in your Supabase credentials.',
  )
}

/**
 * Browser/edge client — usa anon key, respeitando RLS.
 * Para uso em Client Components e Server Actions.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

/**
 * Server-only admin client — usa service_role key, bypassa RLS.
 * NUNCA expor ao browser. Apenas em Server Components / API routes.
 */
export function createAdminClient() {
  const serviceRoleKey = process.env['SUPABASE_SERVICE_ROLE_KEY']
  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
  }
  return createClient<Database>(supabaseUrl!, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
