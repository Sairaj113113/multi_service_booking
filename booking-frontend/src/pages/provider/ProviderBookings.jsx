import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock,
  DollarSign,
  User,
  Mail,
  Phone,
  X,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react'
import { providerBookingAPI } from '../../api/endpoints'
import { PageHeader } from '../../components/admin/PageHeader'
import toast from 'react-hot-toast'

const STATUS_CONFIG = {
  'PENDING_PAYMENT': { label: 'Pending', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  'CONFIRMED': { label: 'Confirmed', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  'BOOKED': { label: 'Booked', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  'CANCELLED': { label: 'Cancelled', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
}

const PAYMENT_CONFIG = {
  'PAID': { label: 'Paid', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  'PENDING': { label: 'Unpaid', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  'FAILED': { label: 'Failed', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
}

export const ProviderBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      const { data } = await providerBookingAPI.getBookings()
      setBookings(data)
    } catch (error) {
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (id) => {
    try {
      await providerBookingAPI.acceptBooking(id)
      toast.success('Booking accepted')
      loadBookings()
    } catch (error) {
      toast.error('Failed to accept booking')
    }
  }

  const handleComplete = async (id) => {
    try {
      await providerBookingAPI.completeBooking(id)
      toast.success('Booking marked as completed')
      loadBookings()
    } catch (error) {
      toast.error('Failed to complete booking')
    }
  }

  const handleCancel = async (id) => {
    try {
      await providerBookingAPI.cancelBooking(id)
      toast.success('Booking cancelled')
      loadBookings()
    } catch (error) {
      toast.error('Failed to cancel booking')
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.serviceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.bookingId?.toString().includes(searchQuery)
    
    const matchesStatus = statusFilter === 'ALL' || booking.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const sortedBookings = [...filteredBookings].sort((a, b) => 
    new Date(b.bookingDate) - new Date(a.bookingDate)
  )

  const totalPages = Math.ceil(sortedBookings.length / itemsPerPage)
  const paginatedBookings = sortedBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getStatusBadge = (status) => {
    const config = STATUS_CONFIG[status] || { label: status, color: 'bg-gray-500/20 text-gray-400' }
    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getPaymentBadge = (status) => {
    const config = PAYMENT_CONFIG[status] || { label: status, color: 'bg-gray-500/20 text-gray-400' }
    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getActionButtons = (booking) => {
    const status = booking.status
    
    if (status === 'PENDING_PAYMENT') {
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAccept(booking.bookingId)}
            className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
            title="Accept"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleCancel(booking.bookingId)}
            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            title="Cancel"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )
    }
    
    if (status === 'CONFIRMED') {
      return (
        <button
          onClick={() => handleComplete(booking.bookingId)}
          className="px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm font-medium"
        >
          Mark Complete
        </button>
      )
    }
    
    return (
      <button
        onClick={() => setSelectedBooking(booking)}
        className="p-2 rounded-lg bg-white/5 text-obsidian-400 hover:bg-white/10 transition-colors"
        title="View Details"
      >
        <Eye className="w-4 h-4" />
      </button>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass-card p-8 animate-pulse">
          <div className="h-8 bg-white/10 rounded w-48 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-white/5 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bookings Management"
        subtitle="View and manage your service bookings"
        icon={Calendar}
      />

      {/* Search and Filters */}
      <div className="glass-card p-4 rounded-xl border border-white/5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-500" />
            <input
              type="text"
              placeholder="Search by user name, service, or booking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-obsidian-900/50 border border-white/10 rounded-xl text-sm text-white placeholder-obsidian-500 focus:outline-none focus:border-gold-500/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-obsidian-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-obsidian-900/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold-500/50 transition-all"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING_PAYMENT">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="BOOKED">Booked</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="glass-card rounded-xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-4 py-3 text-left text-xs font-medium text-obsidian-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-obsidian-500 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-obsidian-500 uppercase tracking-wider">Service</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-obsidian-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-obsidian-500 uppercase tracking-wider">Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-obsidian-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-obsidian-500 uppercase tracking-wider">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-obsidian-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-obsidian-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedBookings.map((booking) => (
                <motion.tr
                  key={booking.bookingId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-4 py-4 text-sm text-white font-medium">#{booking.bookingId}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center text-obsidian-950 font-bold text-xs">
                        {booking.user?.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">{booking.user?.name || 'Unknown'}</p>
                        <p className="text-xs text-obsidian-500">{booking.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-white">{booking.serviceName}</td>
                  <td className="px-4 py-4 text-sm text-obsidian-300">{booking.bookingDate}</td>
                  <td className="px-4 py-4 text-sm text-obsidian-300">{booking.bookingTime}</td>
                  <td className="px-4 py-4 text-sm text-gold-400 font-medium">${booking.amount}</td>
                  <td className="px-4 py-4">{getPaymentBadge(booking.paymentStatus)}</td>
                  <td className="px-4 py-4">{getStatusBadge(booking.status)}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {getActionButtons(booking)}
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="p-2 rounded-lg bg-white/5 text-obsidian-400 hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginatedBookings.length === 0 && (
          <div className="p-8 text-center">
            <Calendar className="w-12 h-12 text-obsidian-600 mx-auto mb-4" />
            <p className="text-obsidian-400">No bookings found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-sm text-obsidian-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedBookings.length)} of {sortedBookings.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white/5 text-obsidian-400 hover:bg-white/10 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-white px-3">{currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white/5 text-obsidian-400 hover:bg-white/10 disabled:opacity-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedBooking(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card rounded-2xl border border-white/10 max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Booking Details</h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 rounded-lg hover:bg-white/5 text-obsidian-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                {/* User Info */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center text-obsidian-950 font-bold text-xl">
                    {selectedBooking.user?.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{selectedBooking.user?.name || 'Unknown'}</h4>
                    <p className="text-obsidian-500 text-sm">Customer</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-obsidian-900/50">
                    <Mail className="w-4 h-4 text-gold-400" />
                    <div>
                      <p className="text-xs text-obsidian-500">Email</p>
                      <p className="text-sm text-white">{selectedBooking.user?.email || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-obsidian-900/50">
                    <Phone className="w-4 h-4 text-gold-400" />
                    <div>
                      <p className="text-xs text-obsidian-500">Phone</p>
                      <p className="text-sm text-white">{selectedBooking.user?.phone || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-obsidian-900/50">
                    <Calendar className="w-4 h-4 text-gold-400" />
                    <div>
                      <p className="text-xs text-obsidian-500">Service</p>
                      <p className="text-sm text-white">{selectedBooking.serviceName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-obsidian-900/50">
                    <Clock className="w-4 h-4 text-gold-400" />
                    <div>
                      <p className="text-xs text-obsidian-500">Date & Time</p>
                      <p className="text-sm text-white">{selectedBooking.bookingDate} at {selectedBooking.bookingTime}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-obsidian-900/50">
                    <DollarSign className="w-4 h-4 text-gold-400" />
                    <div>
                      <p className="text-xs text-obsidian-500">Amount</p>
                      <p className="text-sm text-white">${selectedBooking.amount}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-obsidian-900/50">
                    <div>
                      <p className="text-xs text-obsidian-500 mb-1">Status</p>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(selectedBooking.status)}
                        {getPaymentBadge(selectedBooking.paymentStatus)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
