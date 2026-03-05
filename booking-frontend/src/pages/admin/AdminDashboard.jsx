import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { adminAPI } from '../../api/endpoints'
import toast from 'react-hot-toast'
import { Users, Calendar, Building2, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'

// Dashboard Components
import { StatCard } from '../../components/admin/StatCard'
import { RevenueChart } from '../../components/admin/RevenueChart'
import { BookingTrendChart } from '../../components/admin/BookingTrendChart'
import { StatusDistributionChart } from '../../components/admin/StatusDistributionChart'
import { ActivityFeed } from '../../components/admin/ActivityFeed'
import { OverviewMetrics } from '../../components/admin/OverviewMetrics'
import { TopServices } from '../../components/admin/TopServices'

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

  const statCards = [
    {
      title: 'Total Users',
      value: formatNumber(stats?.totalUsers),
      icon: Users,
      trend: '+12%',
      trendUp: true,
      color: 'blue'
    },
    {
      title: 'Total Providers',
      value: formatNumber(stats?.totalProviders),
      icon: Building2,
      trend: '+8%',
      trendUp: true,
      color: 'purple'
    },
    {
      title: 'Total Bookings',
      value: formatNumber(stats?.totalBookings),
      icon: Calendar,
      trend: '+15%',
      trendUp: true,
      color: 'green'
    },
    {
      title: 'Revenue',
      value: `$${formatCurrency(stats?.totalRevenue)}`,
      icon: DollarSign,
      trend: '+23%',
      trendUp: true,
      color: 'gold'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-3xl sm:text-4xl text-white">
            Dashboard <span className="gold-text">Overview</span>
          </h1>
          <p className="text-obsidian-400 mt-2">
            Welcome back! Here's what's happening with your platform today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-obsidian-400">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>Live updates</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl animate-pulse">
              <div className="h-4 bg-white/10 rounded w-24 mb-4"></div>
              <div className="h-8 bg-white/10 rounded w-16"></div>
            </div>
          ))
        ) : (
          statCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass-card p-6 rounded-2xl border border-white/5 hover:border-gold-500/30 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-obsidian-400 text-sm font-medium">{card.title}</p>
                  <p className="text-3xl font-display font-bold text-white mt-2">{card.value}</p>
                  <div className={`flex items-center gap-1 mt-2 text-sm ${card.trendUp ? 'text-green-400' : 'text-red-400'}`}>
                    {card.trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{card.trend}</span>
                    <span className="text-obsidian-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-${card.color}-500/10 border border-${card.color}-500/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <card.icon className={`w-6 h-6 text-${card.color}-400`} />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart stats={stats} />
        </div>
        <StatusDistributionChart stats={stats} />
      </div>

      {/* Booking Trends */}
      <BookingTrendChart stats={stats} />

      {/* Activity & Top Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed />
        <TopServices />
      </div>
    </div>
  )
}
