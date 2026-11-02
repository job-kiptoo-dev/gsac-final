import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSite } from '../context/SiteContext'
import logo from '../assets/logo.png'

export default function Login() {
  const { login, register, useSupabase } = useSite()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', organization: '' })
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccessMsg('')
    if (mode === 'register') {
      if (!form.name.trim()) { setError('Please enter your full name.'); return }
      if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
      if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    }
    setLoading(true)
    try {
      if (mode === 'login') {
        const result = await login(form.email, form.password)
        if (result.success) {
          const role = result.user?.role || result.user?.user_metadata?.role
          navigate(role === 'admin' ? '/admin' : '/')
        } else {
          setError(result.error || 'Login failed. Please check your credentials.')
        }
      } else {
        const result = await register({ name: form.name, email: form.email, password: form.password, organization: form.organization })
        if (result.success) {
          if (result.needsConfirmation) {
            setSuccessMsg('Registration successful! Please check your email to confirm your account before signing in.')
            setMode('login')
          } else {
            navigate('/')
          }
        } else {
          setError(result.error || 'Registration failed. Please try again.')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <img src={logo} alt="GSAC" className="h-12 w-auto" />
            <div className="text-left">
              <div className="text-teal-deep font-black text-lg">GSAC</div>
              <div className="text-gray-400 text-xs">Global Skills Advancement Center</div>
            </div>
          </Link>
          <h1 className="text-2xl font-black text-navy">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {mode === 'login' ? 'Sign in to your GSAC account' : 'Join the GSAC learning community'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-8">
          {/* Mode toggle */}
          <div className="flex bg-surface rounded-xl p-1 mb-6">
            {['login','register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); setSuccessMsg('') }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${mode === m ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
          {successMsg && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-4">{successMsg}</div>}

          {!useSupabase && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-2 rounded-lg mb-4">
              <strong>Demo mode:</strong> admin@gsac.org / admin123
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Organization</label>
                  <input name="organization" value={form.organization} onChange={handleChange} className="input-field" placeholder="Company or institution" />
                </div>
              </>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-field" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password *</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required className="input-field" placeholder="••••••••" />
            </div>
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm Password *</label>
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required className="input-field" placeholder="••••••••" />
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60 mt-2">
              {loading ? (
                <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Processing…</>
              ) : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-xs text-gray-400 hover:text-teal-deep transition-colors">← Back to website</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
