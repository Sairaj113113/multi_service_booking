import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { PageLayout } from '../components/layout/PageLayout'
import { SectionLabel } from '../components/ui/GoldDivider'

export const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const user = await login(form)
      if (user.role === 'ROLE_USER') navigate('/my-bookings')
      else if (user.role === 'ROLE_PROVIDER') navigate('/services')
      else navigate(from)
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Invalid credentials' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout noFooter>
      <div className="min-h-screen flex items-center justify-center px-6 py-20 relative">
        {/* Background orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-gold-500/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-gold-600/4 blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <SectionLabel>Welcome Back</SectionLabel>
            <h1 className="font-display text-4xl mt-6 mb-2">
              Sign <span className="gold-text italic">In</span>
            </h1>
            <p className="text-obsidian-400 text-sm">Access your bookings and appointments</p>
          </div>

          <div className="glass-card p-8">
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
              >
                {errors.general}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-obsidian-300 mb-1.5 font-mono">Email</label>
                <input
                  type="email"
                  className={`input-dark ${errors.email ? 'border-red-500/50 focus:border-red-500/70' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: '' })) }}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm text-obsidian-300 mb-1.5 font-mono">Password</label>
                <input
                  type="password"
                  className={`input-dark ${errors.password ? 'border-red-500/50' : ''}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setErrors(p => ({ ...p, password: '' })) }}
                />
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-obsidian-800/40 border-t-obsidian-950 animate-spin" />
                    Signing in...
                  </>
                ) : 'Sign In'}
              </motion.button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/5 text-center">
              <p className="text-obsidian-400 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-gold-400 hover:text-gold-300 transition-colors">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  )
}
