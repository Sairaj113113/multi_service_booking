import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { adminAPI } from '../../api/endpoints'
import toast from 'react-hot-toast'

const StatusBadge = ({ status, type }) => {
  const styles = {
    // Booking statuses
    PENDING_PAYMENT: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400',
    CONFIRMED: 'bg-green-500/20 border-green-500/40 text-green-400',
    BOOKED: 'bg-blue-500/20 border-blue-500/40 text-blue-400',
    CANCELLED: 'bg-red-500/20 border-red-500/40 text-red-400',
    // Payment statuses
    PENDING: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400',
    PAID: 'bg-green-500/20 border-green-500/40 text-green-400',
    FAILED: 'bg-red-500/20 border-red-500/40 text-red-400',
    REFUNDED: 'bg-gray-500/20 border-gray-500/40 text-gray-400',
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-500/20 border-gray-500/40 text-gray-400'}`}>
      {status}
    </span>
  )
}

export const AdminBookings = () => {
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadBookings()
  }, [])

  useEffect(() => {
    filterBookings()
  }, [bookings, statusFilter, searchQuery])

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

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter)
    }

    // Filter by search query (user name or email)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(b => 
        b.userName?.toLowerCase().includes(query) ||
        b.userEmail?.toLowerCase().includes(query) ||
        b.serviceName?.toLowerCase().includes(query)
      )
    }

    setFilteredBookings(filtered)
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

  if (loading) {
    return (
      <div className="glass-card p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="font-display text-xl gold-text">Booking Management</h2>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by user or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-lg bg-obsidian-800/50 border border-white/10 text-white text-sm focus:border-gold-500/50 focus:outline-none"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-obsidian-800/50 border border-white/10 text-white text-sm focus:border-gold-500/50 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="PENDING_PAYMENT">Pending Payment</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="BOOKED">Booked</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <p className="text-obsidian-400 text-sm">
        Showing {filteredBookings.length} of {bookings.length} bookings
      </p>

      <div className="glass-card border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-obsidian-900/50">
                <th className="text-left px-4 py-3 text-obsidian-400 text-xs font-medium">ID</th>
                <th className="text-left px-4 py-3 text-obsidian-400 text-xs font-medium">User</th>
                <th className="text-left px-4 py-3 text-obsidian-400 text-xs font-medium">Service</th>
                <th className="text-left px-4 py-3 text-obsidian-400 text-xs font-medium">Slot</th>
                <th className="text-left px-4 py-3 text-obsidian-400 text-xs font-medium">Amount</th>
                <th className="text-left px-4 py-3 text-obsidian-400 text-xs font-medium">Status</th>
                <th className="text-left px-4 py-3 text-obsidian-400 text-xs font-medium">Payment</th>
                <th className="text-left px-4 py-3 text-obsidian-400 text-xs font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking, index) => (
                <motion.tr
                  key={booking.bookingId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-3 text-obsidian-300 text-sm font-mono">
                    #{booking.bookingId}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-white text-sm">{booking.userName}</p>
                      <p className="text-obsidian-500 text-xs">{booking.userEmail}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white text-sm">
                    {booking.serviceName}
                  </td>
                  <td className="px-4 py-3 text-obsidian-300 text-xs">
                    {formatDate(booking.slotStartTime)}
                  </td>
                  <td className="px-4 py-3 text-gold-400 text-sm font-medium">
                    {formatCurrency(booking.amount, booking.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={booking.status} type="status" />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={booking.paymentStatus} type="payment" />
                  </td>
                  <td className="px-4 py-3">
                    {(booking.status === 'PENDING_PAYMENT' || booking.status === 'CONFIRMED' || booking.status === 'BOOKED') && (
                      <button
                        onClick={() => handleCancel(booking.bookingId)}
                        disabled={cancelling === booking.bookingId}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-all disabled:opacity-50"
                      >
                        {cancelling === booking.bookingId ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
