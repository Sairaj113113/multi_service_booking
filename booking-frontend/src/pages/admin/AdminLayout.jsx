import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'

const AdminNavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        isActive
          ? 'bg-gold-500 text-obsidian-950'
          : 'text-obsidian-400 hover:text-white hover:bg-white/5'
      }`
    }
  >
    {children}
  </NavLink>
)

export const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-obsidian-950 pt-16">
      {/* Admin Header */}
      <header className="border-b border-white/5 bg-obsidian-900/50 backdrop-blur-xl sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-2xl gold-text">Admin Dashboard</h1>
            <nav className="flex items-center gap-2">
              <AdminNavItem to="/admin/dashboard">Dashboard</AdminNavItem>
              <AdminNavItem to="/admin/users">Users</AdminNavItem>
              <AdminNavItem to="/admin/bookings">Bookings</AdminNavItem>
              <AdminNavItem to="/admin/providers">Providers</AdminNavItem>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  )
}
