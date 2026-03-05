import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { adminAPI } from '../../api/endpoints'
import toast from 'react-hot-toast'
import { Calendar, Search, Filter, ChevronLeft, ChevronRight, Eye, XCircle, RotateCcw } from 'lucide-react'
import { PageHeader } from '../../components/admin/PageHeader'
import { StatusBadge } from '../../components/admin/StatusBadge'

export const AdminBookings = () => {
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    loadBookings()
  }, [])

  useEffect(() => {
    filterBookings()
  }, [bookings, statusFilter, paymentFilter, searchQuery])

  const loadBookings = async () => {
    try {
      const { data } = await adminAPI.getAllBookings()
      setBookings(data)
    } catch (error) {
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const filterBookings = () => {
    let filtered = bookings

    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter)
    }

    if (paymentFilter !== 'all') {
      filtered = filtered.filter(b => b.paymentStatus === paymentFilter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(b => 
        b.userName?.toLowerCase().includes(query) ||
        b.userEmail?.toLowerCase().includes(query) ||
        b.serviceName?.toLowerCase().includes(query)
      )
    }

    setFilteredBookings(filtered)
    setCurrentPage(1)
  }

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return
    
    setCancelling(bookingId)
    try {
      await adminAPI.cancelBooking(bookingId)
      toast.success('Booking cancelled successfully')
      loadBookings()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking')
    } finally {
      setCancelling(null)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCurrency = (amount, currency = 'USD') => {
    if (amount === undefined || amount === null) return '-'
    return `${currency} ${parseFloat(amount).toFixed(2)}`
  }

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'PENDING_PAYMENT').length,
    confirmed: bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'BOOKED').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
    revenue: bookings.reduce((sum, b) => sum + (b.amount || 0), 0)
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
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Bookings', value: stats.total, color: 'gold' },
          { label: 'Pending', value: stats.pending, color: 'yellow' },
          { label: 'Confirmed', value: stats.confirmed, color: 'green' },
          { label: 'Cancelled', value: stats.cancelled, color: 'red' },
          { label: 'Revenue', value: `$${stats.revenue.toFixed(2)}`, color: 'purple' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-4 rounded-xl border border-white/5"
          >
            <p className="text-obsidian-400 text-xs">{stat.label}</p>
            <p className="text-xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <PageHeader
        title="Booking Management"
        subtitle="Manage and monitor all platform bookings"
        icon={Calendar}
      />

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-500" />
          <input
            type="text"
            placeholder="Search by user, email, or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-obsidian-900/50 border border-white/10 rounded-xl text-sm text-white placeholder-obsidian-500 focus:outline-none focus:border-gold-500/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-obsidian-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-obsidian-900/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold-500/50 transition-all"
          >
            <option value="all">All Statuses</option>
            <option value="PENDING_PAYMENT">Pending Payment</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="BOOKED">Booked</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-4 py-2.5 bg-obsidian-900/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold-500/50 transition-all"
          >
            <option value="all">All Payments</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card border border-white/5 overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-obsidian-900/50">
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">Booking ID</th>
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">User</th>
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">Service</th>
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">Date & Time</th>
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">Amount</th>
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">Status</th>
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">Payment</th>
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {paginatedBookings.map((booking, index) => (
                  <motion.tr
                    key={booking.bookingId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-obsidian-300 text-sm font-mono">#{booking.bookingId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white text-sm font-medium">{booking.userName}</p>
                        <p className="text-obsidian-500 text-xs">{booking.userEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white text-sm">{booking.serviceName}</td>
                    <td className="px-6 py-4 text-obsidian-300 text-sm">{formatDate(booking.slotStartTime)}</td>
                    <td className="px-6 py-4 text-gold-400 text-sm font-medium">{formatCurrency(booking.amount, booking.currency)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={booking.status} size="sm" />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={booking.paymentStatus} size="sm" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toast.info('View details coming soon')}
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-obsidian-400" />
                        </button>
                        {(booking.status === 'PENDING_PAYMENT' || booking.status === 'CONFIRMED' || booking.status === 'BOOKED') && (
                          <button
                            onClick={() => handleCancel(booking.bookingId)}
                            disabled={cancelling === booking.bookingId}
                            className="p-2 rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50"
                            title="Cancel Booking"
                          >
                            <XCircle className="w-4 h-4 text-red-400" />
                          </button>
                        )}
                        {booking.status === 'CANCELLED' && booking.paymentStatus === 'PAID' && (
                          <button
                            onClick={() => toast.info('Refund processing coming soon')}
                            className="p-2 rounded-lg hover:bg-gold-500/10 transition-colors"
                            title="Process Refund"
                          >
                            <RotateCcw className="w-4 h-4 text-gold-400" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {paginatedBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-obsidian-500 mx-auto mb-4" />
            <p className="text-obsidian-400">No bookings found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
            <p className="text-obsidian-400 text-sm">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length} bookings
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
