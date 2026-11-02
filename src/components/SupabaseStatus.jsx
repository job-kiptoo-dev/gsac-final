// src/components/SupabaseStatus.jsx
// ─────────────────────────────────────────────────────────────
// Small indicator shown in dev mode to show Supabase connection status.
// Only renders in development (import.meta.env.DEV).
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react'
import { checkConnection, supabase } from '../lib/supabase'

export default function SupabaseStatus() {
  const [status, setStatus] = useState(null) // null | 'checking' | 'connected' | 'disconnected' | 'unconfigured'
  const [reason, setReason] = useState('')
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!import.meta.env.DEV) return

    if (!supabase) {
      setStatus('unconfigured')
      return
    }

    setStatus('checking')
    checkConnection().then(({ connected, reason: r }) => {
      setStatus(connected ? 'connected' : 'disconnected')
      if (r) setReason(r)
    })
  }, [])

  // Only show in dev mode
  if (!import.meta.env.DEV || !visible || !status) return null

  const styles = {
    connected:    'bg-green-100 border-green-400 text-green-800',
    disconnected: 'bg-red-100 border-red-400 text-red-800',
    unconfigured: 'bg-yellow-100 border-yellow-400 text-yellow-800',
    checking:     'bg-gray-100 border-gray-400 text-gray-700',
  }

  const icons = {
    connected:    '🟢',
    disconnected: '🔴',
    unconfigured: '🟡',
    checking:     '⏳',
  }

  const messages = {
    connected:    'Supabase connected',
    disconnected: `Supabase error: ${reason || 'unknown'}`,
    unconfigured: 'Supabase not configured — running with local data. Copy .env.example → .env to connect.',
    checking:     'Checking Supabase…',
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-[9999] flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium shadow-md max-w-sm ${styles[status]}`}
      role="status"
    >
      <span>{icons[status]}</span>
      <span>{messages[status]}</span>
      <button
        onClick={() => setVisible(false)}
        className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  )
}
