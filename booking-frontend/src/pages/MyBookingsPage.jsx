import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageLayout } from '../components/layout/PageLayout'
import { BookingCard } from '../components/booking/BookingCard'
import { SkeletonList } from '../components/ui/SkeletonCard'
import { EmptyState } from '../components/ui/EmptyState'
import { SectionLabel } from '../components/ui/GoldDivider'
import { bookingsAPI } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'PENDING_PAYMENT', label: 'Pending Payment' },
  { key: 'BOOKED', label: 'Active' },
  { key: 'CANCELLED', label: 'Cancelled' },
]

export const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    bookingsAPI.getMyBookings()
      .then(r => setBookings(r.data))
      .catch(() => setError('Failed to load bookings'))
      .finally(() => setLoading(false))
  }, [])

  const handleCancelled = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b))
  }

  const filtered = activeTab === 'all' ? bookings : bookings.filter(b => b.status === activeTab)
  const activeCount = bookings.filter(b => b.status === 'BOOKED' || b.status === 'PENDING_PAYMENT').length

  return (
    <PageLayout>
      {/* Header */}
      <section className="relative py-20 px-6 border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gold-500/5 blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <SectionLabel>Your Account</SectionLabel>
            <div className="flex items-start justify-between gap-4 mt-6 flex-wrap">
              <div>
                <h1 className="font-display text-4xl md:text-5xl mb-2">
                  My <span className="gold-text italic">Bookings</span>
                </h1>
                <p className="text-obsidian-300 text-sm">Welcome back, <span className="text-gold-400">{user?.name}</span></p>
              </div>
              {activeCount > 0 && (
                <div className="glass-card px-5 py-3 text-center">
                  <p className="text-3xl font-display gold-text font-semibold">{activeCount}</p>
                  <p className="text-obsidian-400 text-xs font-mono">Active Booking{activeCount !== 1 ? 's' : ''}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 p-1 bg-obsidian-800/40 rounded-xl border border-white/5 w-fit">
          {tabs.map(tab => {
            const count = tab.key === 'all' ? bookings.length : bookings.filter(b => b.status === tab.key).length
            return (
              <motion.button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-5 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.key ? 'text-obsidian-950' : 'text-obsidian-400 hover:text-white'
                }`}
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gold-gradient rounded-lg"
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
                {count > 0 && (
                  <span className={`relative z-10 ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.key ? 'bg-obsidian-950/30 text-obsidian-950' : 'bg-obsidian-700/60 text-obsidian-300'
                  }`}>
                    {count}
                  </span>
                )}
              </motion.button>
            )
          })}
        </div>

        {/* List */}
        {loading ? (
          <SkeletonList count={3} />
        ) : error ? (
          <EmptyState
            icon="⚠️"
            title="Failed to Load Bookings"
            description={error}
            action={{ label: 'Retry', onClick: () => window.location.reload() }}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={activeTab === 'CANCELLED' ? '🗑' : '📅'}
            title={activeTab === 'all' ? 'No Bookings Yet' : activeTab === 'BOOKED' ? 'No Active Bookings' : 'No Cancelled Bookings'}
            description={activeTab === 'all' ? 'Start by exploring our services and booking your first appointment.' : 'Nothing here yet.'}
            action={activeTab !== 'CANCELLED' ? {
              label: 'Browse Services',
              onClick: () => navigate('/services')
            } : undefined}
          />
        ) : (
          <motion.div layout className="space-y-4">
            <AnimatePresence>
              {filtered.map(booking => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancelled={handleCancelled}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </PageLayout>
  )
}
