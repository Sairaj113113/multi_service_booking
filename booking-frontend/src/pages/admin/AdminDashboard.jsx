import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { adminAPI } from '../../api/endpoints'
import toast from 'react-hot-toast'

const StatCard = ({ title, value, icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    className="glass-card p-6 border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-obsidian-400 text-sm font-medium">{title}</p>
        <p className="text-3xl font-display gold-text mt-2">{value}</p>
      </div>
      <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-xl">
        {icon}
      </div>
    </div>
  </motion.div>
)

const RevenueCard = ({ title, value, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="glass-card p-6 border border-gold-500/20"
  >
    <p className="text-obsidian-400 text-sm font-medium">{title}</p>
    <p className="text-4xl font-display gold-text mt-2">${value}</p>
  </motion.div>
)

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      const { data } = await adminAPI.getDashboardStats()
      setStats(data)
    } catch (error) {
      toast.error('Failed to load dashboard stats')
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0'
    return num.toLocaleString()
  }

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '0.00'
    return parseFloat(amount).toFixed(2)
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="glass-card p-6 animate-pulse">
                    <div className="h-4 bg-white/10 rounded w-24 mb-4"></div>
                    <div className="h-8 bg-white/10 rounded w-16"></div>
                  </div>
                ))}
              </div>
            ) : stats ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Total Users"
                    value={formatNumber(stats.totalUsers)}
                    icon="👥"
                    delay={0}
                  />
                  <StatCard
                    title="Total Bookings"
                    value={formatNumber(stats.totalBookings)}
                    icon="📅"
                    delay={0.1}
                  />
                  <StatCard
                    title="Active Bookings"
                    value={formatNumber(stats.activeBookings)}
                    icon="✅"
                    delay={0.2}
                  />
                  <StatCard
                    title="Cancelled"
                    value={formatNumber(stats.cancelledBookings)}
                    icon="❌"
                    delay={0.3}
                  />
                </div>

                {/* Revenue Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <RevenueCard
                    title="Today's Revenue"
                    value={formatCurrency(stats.todayRevenue)}
                    delay={0.4}
                  />
                  <RevenueCard
                    title="Total Revenue"
                    value={formatCurrency(stats.totalRevenue)}
                    delay={0.5}
                  />
                </div>

                {/* Quick Stats */}
                <div className="glass-card p-6 border border-gold-500/20">
                  <h3 className="font-display text-lg gold-text mb-4">Quick Overview</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-3xl font-display gold-text">{formatNumber(stats.totalProviders)}</p>
                      <p className="text-obsidian-400 text-sm">Total Providers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-display gold-text">
                        {stats.totalBookings > 0 
                          ? ((stats.activeBookings / stats.totalBookings) * 100).toFixed(1)
                          : 0}%
                      </p>
                      <p className="text-obsidian-400 text-sm">Confirmation Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-display gold-text">
                        {stats.totalBookings > 0
                          ? ((stats.cancelledBookings / stats.totalBookings) * 100).toFixed(1)
                          : 0}%
                      </p>
                      <p className="text-obsidian-400 text-sm">Cancellation Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-display gold-text">
                        {stats.totalBookings > 0
                          ? (stats.totalRevenue / stats.totalBookings).toFixed(2)
                          : '0.00'}
                      </p>
                      <p className="text-obsidian-400 text-sm">Avg. Revenue/Booking</p>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
    </div>
  )
}
