import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const VisitorContext = createContext(null)

const USD_TO_KES_RATE = Number(import.meta.env.VITE_USD_TO_KES_RATE || 129.5)
const CACHE_KEY = 'gsac_visitor_location_v1'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

function getFallbackPreference() {
  const locale = (navigator.language || '').toLowerCase()
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
  const isKenya = locale.includes('ke') || timezone.toLowerCase().includes('nairobi')
  return {
    countryCode: isKenya ? 'KE' : 'US',
    countryName: isKenya ? 'Kenya' : 'United States',
    currency: isKenya ? 'KES' : 'USD',
    source: 'fallback',
  }
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.timestamp || Date.now() - parsed.timestamp > CACHE_TTL_MS) return null
    return parsed.value
  } catch {
    return null
  }
}

function writeCache(value) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ value, timestamp: Date.now() }))
  } catch {
    // no-op
  }
}

async function detectLocation() {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 2500)

  try {
    const response = await fetch('https://ipapi.co/json/', { signal: controller.signal })
    if (!response.ok) throw new Error('Location lookup failed')
    const data = await response.json()
    const isKenya = data?.country_code === 'KE'
    return {
      countryCode: data?.country_code || (isKenya ? 'KE' : 'US'),
      countryName: data?.country_name || (isKenya ? 'Kenya' : 'United States'),
      currency: isKenya ? 'KES' : 'USD',
      source: 'ipapi',
    }
  } catch {
    return getFallbackPreference()
  } finally {
    clearTimeout(timeout)
  }
}

export function VisitorProvider({ children }) {
  const [preference, setPreference] = useState(() => readCache() || getFallbackPreference())

  useEffect(() => {
    let active = true

    async function bootstrap() {
      const detected = await detectLocation()
      if (!active || !detected) return
      setPreference(detected)
      writeCache(detected)
    }

    bootstrap()
    return () => { active = false }
  }, [])

  const value = useMemo(() => {
    const currency = preference.currency || 'USD'
    const exchangeRate = currency === 'KES' ? USD_TO_KES_RATE : 1

    const convertPrice = (amount) => {
      const numeric = Number(amount || 0)
      if (Number.isNaN(numeric)) return 0
      return currency === 'KES' ? numeric * USD_TO_KES_RATE : numeric
    }

    const formatPrice = (amount, options = {}) => {
      const numeric = convertPrice(amount)
      const locale = currency === 'KES' ? 'en-KE' : 'en-US'
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        maximumFractionDigits: options.maximumFractionDigits ?? 0,
      }).format(numeric)
    }

    return {
      ...preference,
      currency,
      exchangeRate,
      isKenya: currency === 'KES',
      convertPrice,
      formatPrice,
      setPreference: (next) => {
        setPreference(next)
        writeCache(next)
      },
    }
  }, [preference])

  return <VisitorContext.Provider value={value}>{children}</VisitorContext.Provider>
}

export function useVisitor() {
  const context = useContext(VisitorContext)
  if (!context) throw new Error('useVisitor must be used within VisitorProvider')
  return context
}
