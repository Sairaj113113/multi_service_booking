import React, { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Search,
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
  Eye,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Briefcase,
  CheckSquare,
  CreditCard,
  History,
  Banknote,
  Activity,
} from 'lucide-react'
import { providerBookingAPI } from '../../api/endpoints'
import { PageHeader } from '../../components/admin/PageHeader'
import toast from 'react-hot-toast'

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────

/**
 * FIX 1 & 6: Corrected status labels and badge colours.
 *   BOOKED      → "Active"     (was incorrectly "Completed")
 *   COMPLETED   → "Completed"
 *   CANCELLED   → "Cancelled"
 *   PENDING_PAYMENT → "Pending"
 */
const STATUS_CONFIG = {
  PENDING_PAYMENT: {
    label: 'Pending',
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    icon: Clock,
  },
  BOOKED: {
    label: 'Active',   // ← FIXED (was "Completed")
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: Activity,
  },
  COMPLETED: {
    label: 'Completed',
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    icon: CheckSquare,
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    icon: XCircle,
  },
}

/**
 * FIX 3: Added CASH payment status.
 */
const PAYMENT_CONFIG = {
  PAID: {
    label: 'Paid',
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    icon: CreditCard,
  },
  PENDING: {
    label: 'Unpaid',
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    icon: Clock,
  },
  CASH: {
    label: 'Cash Payment',
    color: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    icon: Banknote,
  },
}

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

const StatCard = ({ title, value, change, changeType, icon: Icon, gradient }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(201,162,39,0.15)' }}
    className={`glass-card p-6 rounded-2xl border border-white/10 ${gradient} relative overflow-hidden group`}
  >
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <Icon className="w-16 h-16" />
    </div>
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-white/5 backdrop-blur-sm">
          <Icon className="w-5 h-5 text-gold-400" />
        </div>
        <span className="text-sm font-medium text-obsidian-400">{title}</span>
      </div>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-white">{value}</span>
        {change && (
          <span
            className={`text-xs font-medium flex items-center gap-1 ${
              changeType === 'up' ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {changeType === 'up' ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {change}
          </span>
        )}
      </div>
    </div>
  </motion.div>
)

// ─────────────────────────────────────────────
// BOOKING DETAIL DRAWER
// ─────────────────────────────────────────────

/**
 * FIX 2: Action buttons now follow the correct status→action mapping:
 *   PENDING_PAYMENT → Accept + Cancel
 *   BOOKED          → Mark Complete
 *   COMPLETED       → (no actions)
 *   CANCELLED       → (no actions)
 */
const BookingDrawer = ({ booking, isOpen, onClose, onAccept, onComplete, onCancel }) => {
  if (!booking) return null

  const StatusIcon = STATUS_CONFIG[booking.status]?.icon || Clock

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-[#0a0a0f] border-l border-white/10 z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0a0a0f]/95 backdrop-blur-xl z-10">
              <div>
                <h2 className="text-xl font-bold text-white">Booking Details</h2>
                <p className="text-sm text-obsidian-500">#{booking.bookingId}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/10 text-obsidian-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="glass-card p-5 rounded-xl border border-white/5">
                <h3 className="text-sm font-semibold text-gold-400 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Customer Information
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center text-obsidian-950 font-bold text-xl">
                    {booking.user?.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      {booking.user?.name || 'Unknown'}
                    </h4>
                    <div className="flex items-center gap-2 text-obsidian-400 text-sm">
                      <Mail className="w-3 h-3" />
                      {booking.user?.email}
                    </div>
                  </div>
                </div>
                {booking.user?.phone && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <Phone className="w-4 h-4 text-gold-400" />
                    <span className="text-white text-sm">{booking.user.phone}</span>
                  </div>
                )}
              </div>

              {/* Service Details */}
              <div className="glass-card p-5 rounded-xl border border-white/5">
                <h3 className="text-sm font-semibold text-gold-400 mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Service Details
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Service', value: booking.serviceName },
                    { label: 'Date', value: booking.bookingDate },
                    { label: 'Time', value: booking.bookingTime },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-obsidian-400 text-sm">{label}</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              <div className="glass-card p-5 rounded-xl border border-white/5">
                <h3 className="text-sm font-semibold text-gold-400 mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payment Information
                </h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-obsidian-400 text-sm">Amount</span>
                  <span className="text-2xl font-bold text-gold-400">${booking.amount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-obsidian-400 text-sm">Status</span>
                  {PAYMENT_CONFIG[booking.paymentStatus] && (
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                        PAYMENT_CONFIG[booking.paymentStatus].color
                      }`}
                    >
                      {PAYMENT_CONFIG[booking.paymentStatus].label}
                    </span>
                  )}
                </div>
              </div>

              {/* Booking Status */}
              <div className="glass-card p-5 rounded-xl border border-white/5">
                <h3 className="text-sm font-semibold text-gold-400 mb-4 flex items-center gap-2">
                  <StatusIcon className="w-4 h-4" />
                  Booking Status
                </h3>
                <span
                  className={`px-4 py-2 rounded-lg text-sm font-medium border inline-flex items-center gap-2 ${
                    STATUS_CONFIG[booking.status]?.color
                  }`}
                >
                  <StatusIcon className="w-3.5 h-3.5" />
                  {STATUS_CONFIG[booking.status]?.label || booking.status}
                </span>
              </div>

              {/* Action Buttons — FIX 2 */}
              <div className="flex gap-3 pt-4">
                {booking.status === 'PENDING_PAYMENT' && (
                  <>
                    <button
                      onClick={() => { onAccept(booking.bookingId); onClose() }}
                      className="flex-1 py-3 px-4 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => { onCancel(booking.bookingId); onClose() }}
                      className="flex-1 py-3 px-4 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                )}

                {booking.status === 'BOOKED' && (
                  <button
                    onClick={() => { onComplete(booking.bookingId); onClose() }}
                    className="w-full py-3 px-4 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <CheckSquare className="w-4 h-4" />
                    Mark Complete
                  </button>
                )}

                {/* COMPLETED and CANCELLED: no actions rendered */}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ─────────────────────────────────────────────
// ACTIVITY TIMELINE
// ─────────────────────────────────────────────

/**
 * FIX 8: Activity messages now reflect what actually happened.
 */
const activityMessage = (booking) => {
  switch (booking.status) {
    case 'PENDING_PAYMENT':
      return `${booking.user?.name || 'A customer'} requested ${booking.serviceName}`
    case 'BOOKED':
      return `${booking.user?.name || 'A customer'} booking confirmed for ${booking.serviceName}`
    case 'COMPLETED':
      return `${booking.serviceName} booking completed for ${booking.user?.name || 'a customer'}`
    case 'CANCELLED':
      return `Booking for ${booking.serviceName} was cancelled`
    default:
      return `${booking.user?.name || 'A customer'} booked ${booking.serviceName}`
  }
}

const ActivityTimeline = ({ activities }) => (
  <div className="space-y-2">
    {activities.length === 0 ? (
      <p className="text-obsidian-500 text-center py-8">No recent activity</p>
    ) : (
      activities.map((activity, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.08 }}
          className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group cursor-default"
        >
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${activity.color}`}
          >
            <activity.icon className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm leading-snug">{activity.message}</p>
            <p className="text-obsidian-500 text-xs mt-1">{activity.time}</p>
          </div>
        </motion.div>
      ))
    )}
  </div>
)

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export const ProviderBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [dateFilter, setDateFilter] = useState('ALL')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    setLoading(true)
    try {
      const { data } = await providerBookingAPI.getBookings()
      setBookings(data)
    } catch {
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  // ── FIX 4: Analytics ──────────────────────────────────────────────────────
  const analytics = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0]

    const todayBookings = bookings.filter((b) => b.bookingDate === todayStr).length

    // Upcoming: future date with an active/pending status
    const upcoming = bookings.filter(
      (b) =>
        new Date(b.bookingDate) >= new Date(todayStr) &&
        ['PENDING_PAYMENT', 'BOOKED'].includes(b.status),
    ).length

    // Completed: status = COMPLETED (not BOOKED)
    const completed = bookings.filter((b) => b.status === 'COMPLETED').length

    // Earnings: include PAID and CASH, exclude PENDING
    const earnings = bookings
      .filter((b) => ['PAID', 'CASH'].includes(b.paymentStatus))
      .reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0)

    return { todayBookings, upcoming, completed, earnings }
  }, [bookings])

  // ── FIX 8: Recent Activity messages ──────────────────────────────────────
  const activities = useMemo(
    () =>
      [...bookings]
        .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
        .slice(0, 5)
        .map((b) => ({
          icon: STATUS_CONFIG[b.status]?.icon || Clock,
          message: activityMessage(b),
          time: b.bookingDate,
          color: STATUS_CONFIG[b.status]?.color || 'bg-obsidian-500/20 text-obsidian-400',
        })),
    [bookings],
  )

  // ── Filtering + Sorting ───────────────────────────────────────────────────
  const filteredBookings = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0]
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    return bookings
      .filter((b) => {
        const matchesSearch =
          b.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.serviceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.bookingId?.toString().includes(searchQuery)

        const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter

        let matchesDate = true
        if (dateFilter === 'TODAY') matchesDate = b.bookingDate === todayStr
        else if (dateFilter === 'WEEK') matchesDate = new Date(b.bookingDate) >= weekAgo

        return matchesSearch && matchesStatus && matchesDate
      })
      .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
  }, [bookings, searchQuery, statusFilter, dateFilter])

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, dateFilter])

  // ── FIX 5 & 9: API actions with correct toast messages ───────────────────
  /**
   * Backend endpoint expectations (adjust if your Spring Boot routes differ):
   *   Accept  : PUT /api/provider/bookings/{id}/accept
   *   Cancel  : PUT /api/provider/bookings/{id}/cancel
   *   Complete: PUT /api/provider/bookings/{id}/complete
   */
  const handleAccept = async (id) => {
    try {
      await providerBookingAPI.acceptBooking(id)
      toast.success('Booking accepted successfully')
      loadBookings() // FIX 2: refresh after action
    } catch {
      toast.error('Failed to accept booking. Please try again.')
    }
  }

  const handleComplete = async (id) => {
    try {
      await providerBookingAPI.completeBooking(id)
      toast.success('Booking marked as completed')
      loadBookings()
    } catch {
      toast.error('Failed to complete booking. Please try again.')
    }
  }

  const handleCancel = async (id) => {
    try {
      await providerBookingAPI.cancelBooking(id)
      toast.success('Booking cancelled')
      loadBookings()
    } catch {
      toast.error('Failed to cancel booking. Please try again.')
    }
  }

  const openDrawer = (booking) => {
    setSelectedBooking(booking)
    setIsDrawerOpen(true)
  }

  // ── Badge helpers ─────────────────────────────────────────────────────────
  const getStatusBadge = (status) => {
    const cfg = STATUS_CONFIG[status]
    if (!cfg) return <span className="text-gray-400 text-xs">{status}</span>
    const Icon = cfg.icon
    return (
      <span
        className={`px-3 py-1.5 rounded-lg text-xs font-medium border inline-flex items-center gap-1.5 ${cfg.color}`}
      >
        <Icon className="w-3 h-3" />
        {cfg.label}
      </span>
    )
  }

  const getPaymentBadge = (status) => {
    const cfg = PAYMENT_CONFIG[status]
    if (!cfg) return <span className="text-gray-400 text-xs">{status}</span>
    return (
      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${cfg.color}`}>
        {cfg.label}
      </span>
    )
  }

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card h-32 rounded-2xl animate-pulse bg-white/5" />
          ))}
        </div>
        <div className="glass-card h-96 rounded-2xl animate-pulse bg-white/5" />
      </div>
    )
  }

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <PageHeader
        title="Booking Command Center"
        subtitle="Manage and track all your service bookings"
        icon={Calendar}
      />

      {/* Analytics Cards — FIX 4 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Bookings"
          value={analytics.todayBookings}
          change="12%"
          changeType="up"
          icon={Calendar}
          gradient="bg-gradient-to-br from-gold-500/10 via-transparent to-transparent"
        />
        <StatCard
          title="Upcoming Jobs"
          value={analytics.upcoming}
          icon={Clock}
          gradient="bg-gradient-to-br from-blue-500/10 via-transparent to-transparent"
        />
        <StatCard
          title="Completed Jobs"
          value={analytics.completed}
          icon={CheckSquare}
          gradient="bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent"
        />
        <StatCard
          title="Total Earnings"
          value={`$${analytics.earnings.toFixed(2)}`}
          change="8%"
          changeType="up"
          icon={DollarSign}
          gradient="bg-gradient-to-br from-violet-500/10 via-transparent to-transparent"
        />
      </div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 rounded-xl border border-white/5"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-500" />
            <input
              type="text"
              placeholder="Search by customer, service, or booking ID…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-obsidian-900/50 border border-white/10 rounded-xl text-sm text-white placeholder-obsidian-500 focus:outline-none focus:border-gold-500/50 transition-all"
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-obsidian-900/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold-500/50 transition-all"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING_PAYMENT">Pending</option>
              <option value="BOOKED">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-3 bg-obsidian-900/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold-500/50 transition-all"
            >
              <option value="ALL">All Time</option>
              <option value="TODAY">Today</option>
              <option value="WEEK">Last 7 Days</option>
            </select>
            <button
              onClick={loadBookings}
              title="Refresh bookings"
              className="p-3 bg-gold-gradient text-obsidian-950 rounded-xl hover:opacity-90 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bookings Table — FIX 7 */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl border border-white/5 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    {['Booking', 'Customer', 'Service & Schedule', 'Payment', 'Status', 'Actions'].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-4 py-4 text-left text-xs font-semibold text-obsidian-400 uppercase tracking-wider whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedBookings.map((booking, index) => (
                    <motion.tr
                      key={booking.bookingId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="group hover:bg-white/[0.04] transition-all duration-200 cursor-default"
                    >
                      {/* ID */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-white/80">
                          #{booking.bookingId}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center text-obsidian-950 font-bold text-sm flex-shrink-0">
                            {booking.user?.name?.charAt(0) || '?'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate max-w-[120px]">
                              {booking.user?.name || 'Unknown'}
                            </p>
                            <p className="text-xs text-obsidian-500 truncate max-w-[120px]">
                              {booking.user?.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Service */}
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-white">{booking.serviceName}</p>
                        <div className="flex items-center gap-2 text-xs text-obsidian-500 mt-1">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          {booking.bookingDate}
                          <Clock className="w-3 h-3 ml-1 flex-shrink-0" />
                          {booking.bookingTime}
                        </div>
                      </td>

                      {/* Payment */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-sm font-semibold text-gold-400">
                            ${booking.amount}
                          </span>
                          {getPaymentBadge(booking.paymentStatus)}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getStatusBadge(booking.status)}
                      </td>

                      {/* Actions — FIX 2 & 7 */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          {/* View detail — always shown */}
                          <button
                            onClick={() => openDrawer(booking)}
                            title="View Details"
                            className="p-2 rounded-lg bg-white/5 text-obsidian-400 hover:bg-gold-500/20 hover:text-gold-400 transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {booking.status === 'PENDING_PAYMENT' && (
                            <>
                              <button
                                onClick={() => handleAccept(booking.bookingId)}
                                title="Accept Booking"
                                className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/25 transition-all"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleCancel(booking.bookingId)}
                                title="Cancel Booking"
                                className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/25 transition-all"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {booking.status === 'BOOKED' && (
                            <button
                              onClick={() => handleComplete(booking.bookingId)}
                              title="Mark as Complete"
                              className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/25 transition-all"
                            >
                              <CheckSquare className="w-4 h-4" />
                            </button>
                          )}

                          {/* COMPLETED and CANCELLED: no additional action buttons */}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty state */}
            {paginatedBookings.length === 0 && (
              <div className="p-12 text-center">
                <Calendar className="w-16 h-16 text-obsidian-600 mx-auto mb-4" />
                <p className="text-obsidian-400 text-lg">No bookings found</p>
                <p className="text-obsidian-500 text-sm mt-1">Try adjusting your filters</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-white/5 flex items-center justify-between">
                <p className="text-sm text-obsidian-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1}–
                  {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of{' '}
                  {filteredBookings.length}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white/5 text-obsidian-400 hover:bg-white/10 disabled:opacity-40 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-white px-3">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white/5 text-obsidian-400 hover:bg-white/10 disabled:opacity-40 transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Activity Timeline — FIX 8 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="glass-card rounded-2xl border border-white/5 p-6">
            <div className="flex items-center gap-3 mb-6">
              <History className="w-5 h-5 text-gold-400" />
              <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            </div>
            <ActivityTimeline activities={activities} />
          </div>
        </motion.div>
      </div>

      {/* Booking Detail Drawer */}
      <BookingDrawer
        booking={selectedBooking}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onAccept={handleAccept}
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
    </div>
  )
}