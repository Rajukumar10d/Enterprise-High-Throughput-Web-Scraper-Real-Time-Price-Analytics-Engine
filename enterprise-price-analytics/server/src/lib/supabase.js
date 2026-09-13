import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.SUPABASE_URL?.trim()
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

const looksLikePlaceholder = (value) =>
  !value ||
  value.toLowerCase().includes('your_supabase') ||
  value.toLowerCase().includes('placeholder') ||
  value.toLowerCase().includes('example')

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseServiceRoleKey &&
    !looksLikePlaceholder(supabaseUrl) &&
    !looksLikePlaceholder(supabaseServiceRoleKey)
)

/**
 * Supabase client for server-side use only.
 * If the project has not been configured with real Supabase credentials,
 * we keep the server running in development mode with an in-memory fallback.
 */
const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null

export default supabase
