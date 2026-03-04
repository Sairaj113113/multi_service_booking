import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `relative text-sm font-body font-medium tracking-wide transition-colors duration-200 group
       ${isActive ? 'text-gold-400' : 'text-obsidian-300 hover:text-white'}`
    }
  >
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-400 group-hover:w-full transition-all duration-300" />
  </NavLink>
)

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const { isAuthenticated, user, logout, isUser, isProvider, isAdmin } = useAuth()

  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileOpen(false)
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-obsidian-950/90 backdrop-blur-xl border-b border-white/5 shadow-glass'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center shadow-gold">
            <span className="text-obsidian-950 font-display font-bold text-sm">L</span>
          </div>
          <span className="font-display text-lg font-semibold tracking-wide">
            <span className="gold-text">Luxe</span>
            <span className="text-white">Book</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">

          <NavItem to="/services">Services</NavItem>

          {isAuthenticated && isUser && (
            <NavItem to="/my-bookings">My Bookings</NavItem>
          )}

          {isAuthenticated && isProvider && (
            <>
              <NavItem to="/provider">Dashboard</NavItem>
              <NavItem to="/provider/services">My Services</NavItem>
              <NavItem to="/provider/create-service">Add Service</NavItem>
            </>
          )}

          {isAuthenticated && isAdmin && (
            <NavItem to="/admin/dashboard">Admin</NavItem>
          )}

        </nav>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="text-sm text-obsidian-300 hover:text-white transition">
                <span className="text-gold-400">{user?.name}</span>
              </Link>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="btn-ghost text-sm px-5 py-2"
              >
                Sign Out
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn-ghost text-sm px-5 py-2">
                Sign In
              </Link>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link to="/register" className="btn-gold text-sm px-5 py-2">
                  Get Started
                </Link>
              </motion.div>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-8 h-8 flex flex-col justify-center gap-1.5"
        >
          <motion.span animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 8 : 0 }} className="block h-0.5 bg-gold-400 w-6 origin-center transition-all" />
          <motion.span animate={{ opacity: mobileOpen ? 0 : 1 }} className="block h-0.5 bg-gold-400 w-4 transition-all" />
          <motion.span animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -8 : 0 }} className="block h-0.5 bg-gold-400 w-6 origin-center transition-all" />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-obsidian-950/95 backdrop-blur-xl border-b border-white/5"
          >
            <div className="px-6 py-4 space-y-4">

              <Link to="/services" onClick={() => setMobileOpen(false)} className="block text-obsidian-200 hover:text-gold-400 py-2">
                Services
              </Link>

              {isAuthenticated && isUser && (
                <Link to="/my-bookings" onClick={() => setMobileOpen(false)} className="block text-obsidian-200 hover:text-gold-400 py-2">
                  My Bookings
                </Link>
              )}

              {isAuthenticated && isProvider && (
                <>
                  <Link to="/provider" onClick={() => setMobileOpen(false)} className="block text-obsidian-200 hover:text-gold-400 py-2">
                    Dashboard
                  </Link>

                  <Link to="/provider/services" onClick={() => setMobileOpen(false)} className="block text-obsidian-200 hover:text-gold-400 py-2">
                    My Services
                  </Link>

                  <Link to="/provider/create-service" onClick={() => setMobileOpen(false)} className="block text-obsidian-200 hover:text-gold-400 py-2">
                    Add Service
                  </Link>
                </>
              )}

              {isAuthenticated && isAdmin && (
                <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)} className="block text-obsidian-200 hover:text-gold-400 py-2">
                  Admin
                </Link>
              )}

              <div className="pt-2 border-t border-white/5 space-y-3">
                {isAuthenticated ? (
                  <button onClick={handleLogout} className="w-full btn-ghost text-sm py-2">
                    Sign Out
                  </button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="block w-full btn-ghost text-sm text-center py-2">
                      Sign In
                    </Link>

                    <Link to="/register" onClick={() => setMobileOpen(false)} className="block w-full btn-gold text-sm text-center py-2">
                      Get Started
                    </Link>
                  </>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}