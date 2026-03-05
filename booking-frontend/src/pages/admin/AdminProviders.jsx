import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { adminAPI } from '../../api/endpoints'
import toast from 'react-hot-toast'
import { Building2, Search, Star, DollarSign, Calendar, ChevronLeft, ChevronRight, MoreVertical, Eye } from 'lucide-react'
import { PageHeader } from '../../components/admin/PageHeader'
import { StatusBadge } from '../../components/admin/StatusBadge'

export const AdminProviders = () => {
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showActions, setShowActions] = useState(null)
  const itemsPerPage = 10

  useEffect(() => {
    loadProviders()
  }, [])

  const loadProviders = async () => {
    try {
      const { data } = await adminAPI.getAllProviders()
      setProviders(data)
    } catch (error) {
      toast.error('Failed to load providers')
    } finally {
      setLoading(false)
    }
  }

  // Filter providers
  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.email?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  // Pagination
  const totalPages = Math.ceil(filteredProviders.length / itemsPerPage)
  const paginatedProviders = filteredProviders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Calculate total revenue across all providers
  const totalRevenue = providers.reduce((sum, p) => sum + (p.revenueGenerated || 0), 0)
  const totalServices = providers.reduce((sum, p) => sum + (p.totalServices || 0), 0)
  const totalBookings = providers.reduce((sum, p) => sum + (p.totalBookingsHandled || 0), 0)

  const stats = {
    total: providers.length,
    services: totalServices,
    bookings: totalBookings,
    revenue: totalRevenue
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass-card p-8 animate-pulse">
          <div className="h-8 bg-white/10 rounded w-48 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-white/5 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Providers', value: stats.total, icon: Building2, color: 'gold' },
          { label: 'Total Services', value: stats.services, icon: Calendar, color: 'blue' },
          { label: 'Total Bookings', value: stats.bookings, icon: Calendar, color: 'green' },
          { label: 'Total Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: 'purple' }
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

      {/* Header */}
      <PageHeader
        title="Provider Management"
        subtitle="Manage service providers and monitor performance"
        icon={Building2}
      />

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-500" />
          <input
            type="text"
            placeholder="Search providers by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-obsidian-900/50 border border-white/10 rounded-xl text-sm text-white placeholder-obsidian-500 focus:outline-none focus:border-gold-500/50 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card border border-white/5 overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-obsidian-900/50">
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">Provider</th>
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">Contact</th>
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">Services</th>
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">Bookings</th>
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">Rating</th>
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">Revenue</th>
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">Status</th>
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {paginatedProviders.map((provider, index) => (
                  <motion.tr
                    key={provider.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center text-obsidian-950 font-bold">
                          {provider.name?.charAt(0)?.toUpperCase() || 'P'}
                        </div>
                        <div>
                          <span className="text-white font-medium block">{provider.name}</span>
                          <span className="text-obsidian-500 text-xs">ID: {provider.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-obsidian-300 text-sm">{provider.email}</p>
                      <p className="text-obsidian-500 text-xs">{provider.phone || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gold-400 font-medium">{provider.totalServices || 0}</span>
                    </td>
                    <td className="px-6 py-4 text-obsidian-300">
                      {provider.totalBookingsHandled || 0}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
                        <span className="text-white text-sm">{(provider.rating || 0).toFixed(1)}</span>
                        <span className="text-obsidian-500 text-xs">({provider.totalReviews || 0})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gold-400 font-medium">
                      ${(provider.revenueGenerated || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={provider.status || 'ACTIVE'} size="sm" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={() => setShowActions(showActions === provider.id ? null : provider.id)}
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-obsidian-400" />
                        </button>
                        
                        <AnimatePresence>
                          {showActions === provider.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 top-full mt-2 w-40 bg-obsidian-900 border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
                            >
                              <button
                                onClick={() => { toast.info('View profile coming soon'); setShowActions(null); }}
                                className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/5 flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                View Profile
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {paginatedProviders.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-obsidian-500 mx-auto mb-4" />
            <p className="text-obsidian-400">No providers found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
            <p className="text-obsidian-400 text-sm">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProviders.length)} of {filteredProviders.length} providers
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-white text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
