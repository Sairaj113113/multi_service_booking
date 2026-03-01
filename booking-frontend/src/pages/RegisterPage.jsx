import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { PageLayout } from '../components/layout/PageLayout'
import { SectionLabel } from '../components/ui/GoldDivider'

const roleOptions = [
  { value: 'ROLE_USER', label: 'Client', desc: 'Book appointments & services', icon: '👤' },
  { value: 'ROLE_PROVIDER', label: 'Provider', desc: 'Offer services & manage slots', icon: '✦' },
]

export const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'ROLE_USER' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'At least 6 characters'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const user = await register(form)
      if (user.role === 'ROLE_USER') navigate('/services')
      else navigate('/services')
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Registration failed' })
    } finally {
      setLoading(false)
    }
  }

  const set = (key, val) => {
    setForm(p => ({ ...p, [key]: val }))
    setErrors(p => ({ ...p, [key]: '' }))
  }

  return (
    <PageLayout noFooter>
      <div className="min-h-screen flex items-center justify-center px-6 py-20 relative">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-gold-500/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full bg-gold-600/4 blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <SectionLabel>Join LuxeBook</SectionLabel>
            <h1 className="font-display text-4xl mt-6 mb-2">
              Create <span className="gold-text italic">Account</span>
            </h1>
            <p className="text-obsidian-400 text-sm">Start your premium booking journey</p>
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
              {/* Role selector */}
              <div>
                <label className="block text-sm text-obsidian-300 mb-2 font-mono">I am a...</label>
                <div className="grid grid-cols-2 gap-3">
                  {roleOptions.map(role => (
                    <motion.button
                      key={role.value}
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={() => set('role', role.value)}
                      className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                        form.role === role.value
                          ? 'border-gold-500 bg-gold-500/10'
                          : 'border-white/10 bg-obsidian-800/40 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xl block mb-1">{role.icon}</span>
                      <span className={`text-sm font-medium block ${form.role === role.value ? 'text-gold-300' : 'text-white'}`}>
                        {role.label}
                      </span>
                      <span className="text-xs text-obsidian-400">{role.desc}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-obsidian-300 mb-1.5 font-mono">Full Name</label>
                <input
                  type="text"
                  className={`input-dark ${errors.name ? 'border-red-500/50' : ''}`}
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm text-obsidian-300 mb-1.5 font-mono">Email</label>
                <input
                  type="email"
                  className={`input-dark ${errors.email ? 'border-red-500/50' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm text-obsidian-300 mb-1.5 font-mono">Password</label>
                <input
                  type="password"
                  className={`input-dark ${errors.password ? 'border-red-500/50' : ''}`}
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
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
                    Creating account...
                  </>
                ) : 'Create Account'}
              </motion.button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/5 text-center">
              <p className="text-obsidian-400 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-gold-400 hover:text-gold-300 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  )
}
