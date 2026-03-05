import { PageLayout } from "../../components/layout/PageLayout"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { providerBookingAPI } from "../../api/endpoints"

export default function ProviderDashboard() {
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRecentActivity()
  }, [])

  const loadRecentActivity = async () => {
    try {
      const { data } = await providerBookingAPI.getBookings()
      // Get last 5 bookings sorted by date
      const sorted = data.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
      setRecentBookings(sorted.slice(0, 5))
    } catch (error) {
      console.error('Failed to load recent bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMin = Math.floor(diffMs / 60000)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    if (diffMin < 60) return `${diffMin} min ago`
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  const getStatusColor = (status) => {
    const colors = {
      'CONFIRMED': 'bg-green-400',
      'BOOKED': 'bg-blue-400',
      'PENDING_PAYMENT': 'bg-yellow-400',
      'CANCELLED': 'bg-red-400'
    }
    return colors[status] || 'bg-gray-400'
  }

  const quickActions = [
    {
      to: "/provider/create-service",
      title: "Create Service",
      description: "Add a new service, set pricing, and publish instantly.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      badge: "Quick Action"
    },
    {
      to: "/provider/services",
      title: "Manage Services",
      description: "Update details, manage slots, and keep availability fresh.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      badge: "Manage"
    },
    {
      to: "/provider/bookings",
      title: "View Bookings",
      description: "Track appointments, manage schedules, and view client details.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      badge: "Analytics"
    },
    {
      to: "/profile",
      title: "Profile Settings",
      description: "Update your profile, manage business info, and preferences.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      badge: "Settings"
    }
  ]

  return (
    <PageLayout>
      <div className="min-h-screen pt-24 pb-16 px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto mb-12"
        >
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="gold-text">Provider</span>
              <span className="text-white"> Dashboard</span>
            </h1>
            <p className="text-obsidian-400 text-lg max-w-3xl mx-auto">
              Manage your services, track bookings, and grow your business with powerful tools designed for service providers.
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-6xl mx-auto mb-12"
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Services", value: "12", change: "+2 this month", positive: true },
              { label: "Active Bookings", value: "28", change: "+15% this week", positive: true },
              { label: "Revenue", value: "$4,280", change: "+8% this month", positive: true },
              { label: "Rating", value: "4.8", change: "No change", positive: false }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gold-gradient/20 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-gold-400" />
                  </div>
                  <span className={`text-xs font-medium ${stat.positive ? 'text-green-400' : 'text-obsidian-400'}`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-sm text-obsidian-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-2xl font-display font-semibold text-white mb-8">Quick Actions</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <Link
                  to={action.to}
                  className="glass-card group flex min-h-[200px] flex-col justify-between p-8 transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gold-400/40 relative overflow-hidden"
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-400/20 to-transparent" />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gold-gradient/20 flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform duration-300">
                        {action.icon}
                      </div>
                      <span className="text-xs uppercase tracking-[0.2em] text-obsidian-400 font-medium">
                        {action.badge}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-gold-400 transition-colors duration-300">
                      {action.title}
                    </h3>
                    <p className="text-obsidian-400 leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                  
                  <div className="relative z-10 mt-6">
                    <span className="inline-flex items-center gap-2 text-sm text-gold-300 group-hover:text-gold-200 transition-colors duration-300">
                      Get started
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-400/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-6xl mx-auto mt-12"
        >
          <div className="glass-card p-8">
            <h2 className="text-2xl font-display font-semibold text-white mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {loading ? (
                <div className="animate-pulse space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 bg-white/5 rounded-lg"></div>
                  ))}
                </div>
              ) : recentBookings.length === 0 ? (
                <p className="text-obsidian-500 text-center py-4">No recent bookings</p>
              ) : (
                recentBookings.map((booking, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(booking.status)}`} />
                      <div>
                        <p className="text-white font-medium">New booking for {booking.serviceName}</p>
                        <p className="text-sm text-obsidian-400">{booking.user?.name} • ${booking.amount}</p>
                      </div>
                    </div>
                    <span className="text-sm text-obsidian-500">{getRelativeTime(booking.bookingDate)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  )
}