import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Users, DollarSign, Calendar, Briefcase } from 'lucide-react'
import { adminAnalyticsAPI } from '../../api/endpoints'
import { PageHeader } from '../../components/admin/PageHeader'
import toast from 'react-hot-toast'

export const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true)
  const [overview, setOverview] = useState(null)
  const [bookingsTrend, setBookingsTrend] = useState([])
  const [revenueTrend, setRevenueTrend] = useState([])
  const [serviceDistribution, setServiceDistribution] = useState([])
  const [providerPerformance, setProviderPerformance] = useState([])

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const [overviewRes, bookingsRes, revenueRes, serviceRes, providerRes] = await Promise.all([
        adminAnalyticsAPI.getOverview(),
        adminAnalyticsAPI.getBookingsTrend(),
        adminAnalyticsAPI.getRevenueTrend(),
        adminAnalyticsAPI.getServiceDistribution(),
        adminAnalyticsAPI.getProviderPerformance()
      ])

      setOverview(overviewRes.data)
      setBookingsTrend(bookingsRes.data)
      setRevenueTrend(revenueRes.data)
      setServiceDistribution(serviceRes.data)
      setProviderPerformance(providerRes.data)
    } catch (error) {
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ['#C9A227', '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444']

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass-card p-8 animate-pulse">
          <div className="h-8 bg-white/10 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-white/5 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-white/5 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics Dashboard"
        subtitle="Platform performance metrics and insights"
        icon={TrendingUp}
      />

      {/* Overview Stats */}
      {overview && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: overview.totalUsers, icon: Users, color: 'blue' },
            { label: 'Total Providers', value: overview.totalProviders, icon: Briefcase, color: 'purple' },
            { label: 'Total Bookings', value: overview.totalBookings, icon: Calendar, color: 'green' },
            { label: 'Total Revenue', value: `$${overview.totalRevenue?.toFixed(2) || '0.00'}`, icon: DollarSign, color: 'gold' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-4 rounded-xl border border-white/5"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/10 flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                </div>
                <div>
                  <p className="text-obsidian-400 text-xs">{stat.label}</p>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 rounded-xl border border-white/5"
        >
          <h3 className="text-white font-medium mb-4">Bookings Trend (Last 30 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bookingsTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280" 
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Line type="monotone" dataKey="bookings" stroke="#C9A227" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 rounded-xl border border-white/5"
        >
          <h3 className="text-white font-medium mb-4">Revenue Trend (Last 30 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280" 
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#9ca3af' }}
                  formatter={(value) => [`$${value}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#C9A227" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Service Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 rounded-xl border border-white/5"
        >
          <h3 className="text-white font-medium mb-4">Service Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ service, percent }) => `${service} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="service"
                >
                  {serviceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Provider Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 rounded-xl border border-white/5"
        >
          <h3 className="text-white font-medium mb-4">Top Provider Performance</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {providerPerformance.slice(0, 5).map((provider, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-obsidian-900/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center text-obsidian-950 font-bold text-sm">
                    {provider.providerName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{provider.providerName}</p>
                    <p className="text-obsidian-500 text-xs">{provider.totalBookings} bookings</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gold-400 font-medium">${provider.revenueGenerated?.toFixed(2) || '0.00'}</p>
                  <p className="text-obsidian-500 text-xs">⭐ {provider.avgRating?.toFixed(1) || '0.0'}</p>
                </div>
              </div>
            ))}
            {providerPerformance.length === 0 && (
              <p className="text-obsidian-500 text-center py-8">No provider data available</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
