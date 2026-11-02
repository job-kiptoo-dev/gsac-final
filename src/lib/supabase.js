// src/lib/supabase.js
// ─────────────────────────────────────────────────────────────
// Supabase client for GSAC frontend
// Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
// ─────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

// Validate that the values look real (not the placeholder text)
const isValidUrl =
  supabaseUrl &&
  supabaseUrl !== 'https://your-project-ref.supabase.co' &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.includes('.supabase.co')

const isValidKey =
  supabaseKey &&
  supabaseKey !== 'your-anon-public-key-here' &&
  supabaseKey.length > 20

if (!isValidUrl || !isValidKey) {
  console.warn(
    '[GSAC] Supabase env vars missing or contain placeholder values.\n' +
    '  → Copy .env.example to .env and fill in your real Supabase project credentials.\n' +
    '  → The app will run with local in-memory data until Supabase is configured.'
  )
}

// ─────────────────────────────────────────────────────────────
// Create the Supabase client
// IMPORTANT: Do NOT override the global fetch here — it breaks
// auth endpoints (signIn/signUp) which need their own internal
// fetch logic from the supabase-js library.
// ─────────────────────────────────────────────────────────────
export const supabase =
  isValidUrl && isValidKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: true,       // keep user logged in on page refresh
          autoRefreshToken: true,     // silently refresh JWT before expiry
          detectSessionInUrl: true,   // handle magic link / OAuth callbacks
        },
      })
    : null

// ─────────────────────────────────────────────────────────────
// sb() — safe wrapper for ALL Supabase calls
// Handles both table queries AND auth method responses.
// Always returns { data, error } — never throws.
// ─────────────────────────────────────────────────────────────
export async function sb(fn) {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured — running in local mode') }
  }
  try {
    const result = await fn(supabase)

    // Supabase JS v2 always returns { data, error } for both
    // table queries (PostgREST) and auth methods.
    if (
      result !== null &&
      result !== undefined &&
      typeof result === 'object' &&
      ('data' in result || 'error' in result)
    ) {
      return result
    }

    // Fallback for any edge case
    return { data: result ?? null, error: null }
  } catch (err) {
    console.error('[Supabase] Unexpected error:', err)
    return { data: null, error: err }
  }
}

// ─────────────────────────────────────────────────────────────
// Connection health check (used by SupabaseStatus component)
// ─────────────────────────────────────────────────────────────
export async function checkConnection() {
  if (!supabase) return { connected: false, reason: 'not_configured' }
  try {
    const { error } = await supabase.from('site_content').select('id').limit(1)
    if (error) return { connected: false, reason: error.message }
    return { connected: true }
  } catch (err) {
    return { connected: false, reason: err.message }
  }
}
